import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TokenValidationMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }

    const token = authHeader.split(' ')[1];
    try {
      this.jwtService.verify(token);
      next();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
}
