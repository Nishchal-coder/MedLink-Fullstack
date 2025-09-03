import { Request, Response } from 'express';
import { User, Hospital } from '../models';
import { generateTokens, generateAccessToken } from '../utils/jwt';
import { IAuthRequest } from '../types';

export const register = async (req: Request, res: Response) => {
  try {
    const { 
      username, 
      password, 
      role = 'user', 
      hospital, 
      firstName, 
      lastName, 
      contactNumber,
      email,
      dateOfBirth,
      gender,
      address,
      // Admin-specific fields
      hospitalName,
      hospitalAddress,
      hospitalContact,
      adminPosition,
      department,
      employeeId,
      emergencyContact,
      emergencyPhone
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Validate hospital if provided
    let hospitalId = null;
    if (hospital) {
      const hospitalDoc = await Hospital.findById(hospital);
      if (!hospitalDoc) {
        return res.status(400).json({ error: 'Hospital not found' });
      }
      hospitalId = hospital;
    }

    // Create new user
    const user = new User({
      username,
      password,
      role,
      hospital: hospitalId,
      firstName,
      lastName,
      contactNumber,
      email,
      dateOfBirth,
      gender,
      address,
      // Admin-specific fields
      hospitalName,
      hospitalAddress,
      hospitalContact,
      adminPosition,
      department,
      employeeId,
      emergencyContact,
      emergencyPhone
    });

    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user as any);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        hospital: user.hospital?.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        contactNumber: user.contactNumber,
        status: user.status,
        // Admin-specific fields
        hospitalName: user.hospitalName,
        hospitalAddress: user.hospitalAddress,
        hospitalContact: user.hospitalContact,
        adminPosition: user.adminPosition,
        department: user.department,
        employeeId: user.employeeId,
        emergencyContact: user.emergencyContact,
        emergencyPhone: user.emergencyPhone
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is active
    if (user.status !== 'Active') {
      return res.status(401).json({ error: 'Account is inactive' });
    }

    // Verify password
    const isPasswordValid = await (user as any).comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user as any);

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        hospital: user.hospital?.toString(),
        hospitalName: user.hospitalName,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
        mustChangePassword: user.mustChangePassword
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = require('jsonwebtoken').verify(refreshToken, process.env.JWT_SECRET || 'your-secret-key');
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user || user.status !== 'Active') {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: user._id!,
      username: user.username,
      role: user.role,
      hospital: user.hospital?.toString(),
      hospitalName: user.hospitalName || undefined
    });

    res.json({
      accessToken: newAccessToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

export const logout = async (req: IAuthRequest, res: Response) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return a success message
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};

export const getProfile = async (req: IAuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!._id).populate('hospital', 'name location');
    
    res.json({
      user: {
        id: user!._id,
        username: user!.username,
        role: user!.role,
        hospital: user!.hospital,
        firstName: user!.firstName,
        lastName: user!.lastName,
        contactNumber: user!.contactNumber,
        specialization: user!.specialization,
        bio: user!.bio,
        dateOfBirth: user!.dateOfBirth,
        gender: user!.gender,
        address: user!.address,
        status: user!.status,
        mustChangePassword: user!.mustChangePassword,
        createdAt: user!.createdAt,
        updatedAt: user!.updatedAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const updateProfile = async (req: IAuthRequest, res: Response) => {
  try {
    const { firstName, lastName, contactNumber, specialization, bio, dateOfBirth, gender, address } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      {
        firstName,
        lastName,
        contactNumber,
        specialization,
        bio,
        dateOfBirth,
        gender,
        address
      },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user!._id,
        username: user!.username,
        role: user!.role,
        hospital: user!.hospital,
        firstName: user!.firstName,
        lastName: user!.lastName,
        contactNumber: user!.contactNumber,
        specialization: user!.specialization,
        bio: user!.bio,
        dateOfBirth: user!.dateOfBirth,
        gender: user!.gender,
        address: user!.address,
        status: user!.status
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const changePassword = async (req: IAuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Find user with password
    const user = await User.findById(req.user!._id).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await (user as any).comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    user.mustChangePassword = false;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

export const completeInitialSetup = async (req: IAuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { initialSetupCompleted: true },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Initial setup completed successfully',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        hospital: user.hospital,
        firstName: user.firstName,
        lastName: user.lastName,
        contactNumber: user.contactNumber,
        specialization: user.specialization,
        bio: user.bio,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
        status: user.status,
        initialSetupCompleted: user.initialSetupCompleted
      }
    });
  } catch (error) {
    console.error('Complete initial setup error:', error);
    res.status(500).json({ error: 'Failed to complete initial setup' });
  }
};