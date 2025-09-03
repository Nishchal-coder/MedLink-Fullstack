import { Request, Response, NextFunction } from 'express';
import { IAuthRequest } from '../types';

// Middleware to ensure admin can only access their hospital's data
export const requireHospitalAccess = (req: IAuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Superadmin can access all hospitals
  if (req.user.role === 'superadmin') {
    return next();
  }

  // Admin users must have a hospital assigned
  if (req.user.role === 'admin') {
    if (!req.user.hospital) {
      return res.status(403).json({ error: 'Hospital access not configured for this admin' });
    }
    
    // Store the admin's hospital in the request for use in controllers
    req.userHospital = req.user.hospital;
    return next();
  }

  // Other roles (doctor, user) can only access their own hospital
  if (req.user.hospital) {
    req.userHospital = req.user.hospital;
    return next();
  }

  return res.status(403).json({ error: 'Hospital access required' });
};

// Middleware to validate that the requested hospital matches the user's hospital
export const validateHospitalAccess = (req: IAuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Superadmin can access all hospitals
  if (req.user.role === 'superadmin') {
    return next();
  }

  const requestedHospital = req.params.hospital || req.body.hospital;
  
  if (requestedHospital) {
    const userHospital = req.user.hospital;
    
    if (userHospital !== requestedHospital) {
      return res.status(403).json({ 
        error: 'Access denied: You can only access data for your assigned hospital',
        userHospital,
        requestedHospital
      });
    }
  }

  next();
};

// Middleware to ensure admin can only manage doctors for their hospital
export const requireDoctorHospitalAccess = (req: IAuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Superadmin can access all hospitals
  if (req.user.role === 'superadmin') {
    return next();
  }

  // Admin users must have a hospital assigned
  if (req.user.role === 'admin') {
    if (!req.user.hospital) {
      return res.status(403).json({ error: 'Hospital access not configured for this admin' });
    }
    
    // Store the admin's hospital in the request for use in controllers
    req.userHospital = req.user.hospital;
    return next();
  }

  // Doctor users can access search functionality
  if (req.user.role === 'doctor') {
    // Doctors can access search functionality even without hospital assignment
    // Store the doctor's hospital in the request for use in controllers (if available)
    req.userHospital = req.user.hospital || undefined;
    return next();
  }

  return res.status(403).json({ error: 'Access denied: Only admins and doctors can perform this operation' });
};

// Helper function to get user's hospital
export const getUserHospital = (req: IAuthRequest): string | null => {
  if (!req.user) return null;
  
  if (req.user.role === 'superadmin') return null; // Superadmin can access all
  
  return req.user.hospital || null;
};
