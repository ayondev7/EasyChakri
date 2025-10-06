/**
 * CURRENT USER DECORATOR - Get authenticated user in controllers
 * 
 * EXPRESS EQUIVALENT: Just accessing req.user directly
 * 
 * NestJS USAGE: @CurrentUser() user: User in controller method parameters
 * Makes code cleaner than accessing request.user
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../guards/jwt-auth.guard';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
