import { Request, Response, NextFunction } from 'express';
import { AuditLog } from '../models';
import { IAuthRequest } from '../types';

export const auditMiddleware = (action: string, objectType: string) => {
  return async (req: IAuthRequest, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log the action after response is sent
      if (req.user) {
        const objectId = req.params.id || req.body._id || 'unknown';
        
        AuditLog.create({
          user: req.user._id,
          action,
          objectType,
          objectId: objectId.toString(),
          ipAddress: req.ip || req.connection.remoteAddress,
          metadata: {
            method: req.method,
            url: req.originalUrl,
            userAgent: req.get('User-Agent')
          }
        }).catch(err => {
          console.error('Audit log error:', err);
        });
      }
      
      return originalSend.call(this, data);
    };
    
    next();
  };
};

export const auditRead = auditMiddleware('read', 'unknown');
export const auditCreate = auditMiddleware('create', 'unknown');
export const auditUpdate = auditMiddleware('update', 'unknown');
export const auditDelete = auditMiddleware('delete', 'unknown');
export const auditAccess = auditMiddleware('access', 'unknown');
export const auditDownload = auditMiddleware('download', 'unknown');
export const auditShare = auditMiddleware('share', 'unknown');
