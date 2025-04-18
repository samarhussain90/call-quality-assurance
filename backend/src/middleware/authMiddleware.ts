import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include auth fields
declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
    organizationId?: string;
  }
}

export interface AuthRequest extends Request {
  userId: string;
  organizationId: string;
}

// Middleware to authenticate JWT and attach user info
export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || '';
    const payload = jwt.verify(token, secret) as { userId: string; organizationId: string };
    req.userId = payload.userId;
    req.organizationId = payload.organizationId;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
}; 