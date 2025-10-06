/**
 * TOKEN UTILITY - JWT Token Generation
 * 
 * EXPRESS EQUIVALENT: A utility function you'd create in utils/jwt.js
 * 
 * KEY DIFFERENCES:
 * - Same concept in both frameworks
 * - In NestJS, you could also use @nestjs/jwt service, but this is more flexible
 */

import * as jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class TokenUtil {
  /**
   * Generate access token (short-lived, used for authentication)
   */
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '3h',
    });
  }

  /**
   * Generate refresh token (long-lived, used to get new access token)
   */
  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d', // Refresh tokens typically last longer
    });
  }

  /**
   * Generate both tokens at once
   */
  static generateTokens(payload: TokenPayload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  /**
   * Verify and decode token
   */
  static verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Decode token without verification (useful for debugging)
   */
  static decodeToken(token: string): TokenPayload | null {
    return jwt.decode(token) as TokenPayload;
  }
}
