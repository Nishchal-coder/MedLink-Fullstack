import { Request, Response } from 'express';
import { User } from '../models/User';
import { IAuthRequest } from '../types';
import bcrypt from 'bcryptjs';

// Get all users
export const getUsers = async (req: IAuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search, role, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Build query
    const query: any = {};
    
    if (role) {
      query.role = role;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Don't show superadmin users to regular admins
    if (req.user?.role === 'admin') {
      query.role = { $ne: 'superadmin' };
    }

    const users = await User.find(query)
      .select('-password -phoneVerificationCode')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      results: users,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get users by role
export const getUsersByRole = async (req: IAuthRequest, res: Response) => {
  try {
    const { role } = req.params;
    const { page = 1, limit = 10, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Build query
    const query: any = { role };
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Don't show superadmin users to regular admins
    if (req.user?.role === 'admin' && role === 'superadmin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const users = await User.find(query)
      .select('-password -phoneVerificationCode')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      results: users,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error('Get users by role error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get specific user
export const getUser = async (req: IAuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password -phoneVerificationCode');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't allow admins to access superadmin users
    if (req.user?.role === 'admin' && user.role === 'superadmin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Create user
export const createUser = async (req: IAuthRequest, res: Response) => {
  try {
    const userData = req.body;

    // Check if username already exists
    const existingUsername = await User.findOne({ username: userData.username });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email: userData.email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Don't allow admins to create superadmin users
    if (req.user?.role === 'admin' && userData.role === 'superadmin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Set mustChangePassword to true for new users
    userData.mustChangePassword = true;

    const user = new User(userData);
    await user.save();

    // Return user without password
    const userResponse = user.toObject() as any;
    delete userResponse.password;
    delete userResponse.phoneVerificationCode;

    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Update user
export const updateUser = async (req: IAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't allow admins to modify superadmin users
    if (req.user?.role === 'admin' && user.role === 'superadmin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Don't allow changing to superadmin role for admins
    if (req.user?.role === 'admin' && updateData.role === 'superadmin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if username is being changed and if it already exists
    if (updateData.username && updateData.username !== user.username) {
      const existingUsername = await User.findOne({ username: updateData.username });
      if (existingUsername) {
        return res.status(400).json({ error: 'Username already exists' });
      }
    }

    // Check if email is being changed and if it already exists
    if (updateData.email && updateData.email !== user.email) {
      const existingEmail = await User.findOne({ email: updateData.email });
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    // Hash password if it's being updated
    if (updateData.password) {
      const salt = await bcrypt.genSalt(12);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -phoneVerificationCode');

    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user
export const deleteUser = async (req: IAuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't allow deleting superadmin users
    if (user.role === 'superadmin') {
      return res.status(403).json({ error: 'Cannot delete superadmin user' });
    }

    await User.findByIdAndDelete(id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
