import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { TokenUtil } from '../../utils/token.util';

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

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Please sign in to continue.');
    }

    try {
      const payload = TokenUtil.verifyToken(token);
      
      console.log('JWT Guard - Token payload:', payload);

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

      request.user = user;

      return true;
    } catch (error) {
      console.error('JWT Guard - Error:', error.message);
      throw new UnauthorizedException(
        'Your session has expired. Please sign in again.',
      );
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
