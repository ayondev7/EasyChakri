/**
 * JWT AUTH GUARD - Protects Routes with JWT Authentication
 * 
 * EXPRESS EQUIVALENT: Custom middleware function
 * const authMiddleware = async (req, res, next) => {
 *   const token = req.headers.authorization?.split(' ')[1];
 *   const decoded = jwt.verify(token);
 *   req.user = await findUser(decoded.userId);
 *   next();
 * }
 * 
 * KEY DIFFERENCES:
 * - NestJS: Uses Guards with @UseGuards(JwtAuthGuard) decorator
 * - Guards return true/false to allow/deny access
 * - Can be applied to entire controllers or specific routes
 * - Applied like: @UseGuards(JwtAuthGuard) on routes that need protection
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { TokenUtil } from '../../utils/token.util';

// Extend Express Request type to include user
export interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    // Extract token from Authorization header
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Please sign in to continue.');
    }

    try {
      // Verify and decode token
      const payload = TokenUtil.verifyToken(token);
      
      console.log('JWT Guard - Token payload:', payload);

      // Find user in database
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
        },
      });

      console.log('JWT Guard - User found in DB:', user ? 'Yes' : 'No', user ? user.id : 'N/A');

      if (!user) {
        throw new UnauthorizedException('Your account could not be found. Please sign in again.');
      }

      // Attach user to request object
      request.user = user;

      return true;
    } catch (error) {
      console.error('JWT Guard - Error:', error.message);
      throw new UnauthorizedException(
        'Your session has expired. Please sign in again.',
      );
    }
  }

  /**
   * Extract Bearer token from Authorization header
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
