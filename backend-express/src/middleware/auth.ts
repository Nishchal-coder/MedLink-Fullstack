import { Request, Response, NextFunction } from 'express';
import { User } from '../models';
import { verifyToken, JWTPayload } from '../utils/jwt';
import { IAuthRequest } from '../types';

export const authenticate = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (user.status !== 'Active') {
      return res.status(401).json({ error: 'Account is inactive' });
    }

    req.user = user as any;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: IAuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

export const requireSuperAdmin = requireRole(['superadmin']);
export const requireAdmin = requireRole(['superadmin', 'admin']);
export const requireDoctor = requireRole(['superadmin', 'admin', 'doctor']);
export const requireUser = requireRole(['superadmin', 'admin', 'doctor', 'user']);

export const checkMustChangePassword = (req: IAuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.mustChangePassword) {
    return res.status(403).json({ 
      error: 'Password change required',
      mustChangePassword: true 
    });
  }
  next();
};
