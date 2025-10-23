import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { TokenUtil } from '../../utils/token.util';

export interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      return true;
    }

    try {
      const payload = TokenUtil.verifyToken(token);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
        },
      });

      if (user) {
        request.user = user;
      }

      return true;
    } catch (error) {
      return true;
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
