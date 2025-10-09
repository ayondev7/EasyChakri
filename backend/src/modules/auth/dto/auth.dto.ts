/**
 * AUTH DTOs - Data Transfer Objects for Validation
 * 
 * EXPRESS EQUIVALENT: Manual validation with express-validator or joi
 * const { body } = require('express-validator');
 * body('email').isEmail()
 * 
 * KEY DIFFERENCES:
 * - NestJS: Uses class-validator decorators on DTO classes
 * - Automatic validation with ValidationPipe
 * - Type-safe and cleaner than manual validation
 */

import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CredentialSignupDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @IsEnum(UserRole, { message: 'Role must be either SEEKER or RECRUITER' })
  role: UserRole;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Please provide a valid date string for dateOfBirth' })
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  companyDescription?: string;

  @IsOptional()
  @IsString()
  companyWebsite?: string;

  @IsOptional()
  @IsString()
  companyIndustry?: string;

  @IsOptional()
  @IsString()
  companySize?: string;

  @IsOptional()
  @IsString()
  companyLocation?: string;
}

export class CredentialSigninDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}

export class GoogleSigninDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image?: string;
}

export class AuthResponseDto {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    image?: string;
  };
  accessToken: string;
  refreshToken: string;
}
