/**
 * Password Utility - Bcrypt Helper
 * 
 * Provides convenient methods for hashing and comparing passwords
 */

import * as bcrypt from 'bcrypt';

export class PasswordUtil {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Hash a plain text password
   */
  static async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compare plain text password with hashed password
   */
  static async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Validate password strength
   * Returns true if password meets requirements
   */
  static validateStrength(password: string): { valid: boolean; message: string } {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }

    // Add more validation rules as needed
    // const hasUpperCase = /[A-Z]/.test(password);
    // const hasLowerCase = /[a-z]/.test(password);
    // const hasNumber = /\d/.test(password);
    // const hasSpecialChar = /[!@#$%^&*]/.test(password);

    return { valid: true, message: 'Password is valid' };
  }
}
