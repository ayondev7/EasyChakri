/**
 * AUTH MODULE - Groups auth-related components
 * 
 * EXPRESS EQUIVALENT: Not needed in Express
 * 
 * KEY DIFFERENCE:
 * - NestJS organizes code in modules for better structure
 * - Each feature has its own module with controllers, services, etc.
 */

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [JwtAuthGuard], // Export guard so other modules can use it
})
export class AuthModule {}
