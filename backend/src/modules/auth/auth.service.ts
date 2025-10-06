/**
 * AUTH SERVICE - Business Logic for Authentication
 * 
 * EXPRESS EQUIVALENT: Functions in your auth controller or separate auth service file
 * 
 * KEY DIFFERENCES:
 * - NestJS: Services contain business logic, separated from controllers
 * - Controllers handle HTTP, Services handle business logic
 * - Services are injected via dependency injection (@Injectable())
 */

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { TokenUtil } from '../../utils/token.util';
import {
  CredentialSignupDto,
  CredentialSigninDto,
  GoogleSigninDto,
  AuthResponseDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  /**
   * CREDENTIAL SIGNUP - Register new user with email/password
   * 
   * Express equivalent: POST /auth/signup route handler
   */
  async credentialSignup(dto: CredentialSignupDto): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create new user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        role: dto.role,
        phone: dto.phone,
        location: dto.location,
      },
    });

    // Generate tokens
    const tokens = TokenUtil.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * CREDENTIAL SIGNIN - Login with email/password
   * 
   * Express equivalent: POST /auth/signin route handler
   */
  async credentialSignin(dto: CredentialSigninDto): Promise<AuthResponseDto> {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate tokens
    const tokens = TokenUtil.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * GOOGLE SIGNIN - Login/Register with Google OAuth
   * 
   * Express equivalent: POST /auth/google route handler
   * Creates user if doesn't exist, otherwise logs in
   */
  async googleSignin(dto: GoogleSigninDto): Promise<AuthResponseDto> {
    // Check if user exists
    let user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (user) {
      // User exists - just login
      const tokens = TokenUtil.generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } else {
      // User doesn't exist - create new user
      user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          image: dto.image,
          role: dto.role,
          password: '', // No password for Google users
          providerId: 'google',
        },
      });

      const tokens = TokenUtil.generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    }
  }

  /**
   * Refresh Access Token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = TokenUtil.verifyToken(refreshToken);

      // Verify user still exists
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new access token
      const accessToken = TokenUtil.generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
