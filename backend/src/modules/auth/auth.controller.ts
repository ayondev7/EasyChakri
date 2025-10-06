/**
 * AUTH CONTROLLER - HTTP Request Handlers for Authentication
 * 
 * EXPRESS EQUIVALENT: Your route handlers
 * router.post('/signup', async (req, res) => { ... })
 * 
 * KEY DIFFERENCES:
 * - NestJS: Controllers use decorators (@Controller, @Post, @Body)
 * - Routes are defined with decorators instead of router.post()
 * - Automatic dependency injection of services
 * - DTOs automatically validated before reaching the handler
 */

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CredentialSignupDto,
  CredentialSigninDto,
  GoogleSigninDto,
} from './dto/auth.dto';

@Controller('auth') // Base route: /api/auth
export class AuthController {
  constructor(private authService: AuthService) {} // Dependency injection

  /**
   * POST /api/auth/signup
   * Register new user with email/password
   */
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: CredentialSignupDto) {
    const result = await this.authService.credentialSignup(dto);
    return {
      message: 'User registered successfully',
      data: result,
    };
  }

  /**
   * POST /api/auth/signin
   * Login with email/password
   */
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: CredentialSigninDto) {
    const result = await this.authService.credentialSignin(dto);
    return {
      message: 'Login successful',
      data: result,
    };
  }

  /**
   * POST /api/auth/google
   * Login/Register with Google OAuth
   */
  @Post('google')
  @HttpCode(HttpStatus.OK)
  async googleAuth(@Body() dto: GoogleSigninDto) {
    const result = await this.authService.googleSignin(dto);
    return {
      message: 'Google authentication successful',
      data: result,
    };
  }

  /**
   * POST /api/auth/refresh
   * Get new access token using refresh token
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    const result = await this.authService.refreshToken(refreshToken);
    return {
      message: 'Token refreshed successfully',
      data: result,
    };
  }
}
