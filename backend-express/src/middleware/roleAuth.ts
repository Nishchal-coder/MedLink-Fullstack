import { Response, NextFunction } from 'express';
import { IAuthRequest } from '../types';

export const requireUser = (req: IAuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.user.role !== 'user') {
    return res.status(403).json({ error: 'User role required' });
  }
  
  next();
};

export const requireAdmin = (req: IAuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (!['admin', 'superadmin', 'doctor'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Admin, doctor, or superadmin role required' });
  }
  
  next();
};

export const requireSuperAdmin = (req: IAuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Superadmin role required' });
  }
  
  next();
};
