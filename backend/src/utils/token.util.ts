import * as jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class TokenUtil {
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '3h',
    });
  }

  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
  }

  static generateTokens(payload: TokenPayload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  static verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Your session has expired. Please sign in again.');
    }
  }

  static decodeToken(token: string): TokenPayload | null {
    return jwt.decode(token) as TokenPayload;
  }
}
