/**
 * Common Types for the Application
 * 
 * These types are used across multiple modules
 */

import { User as PrismaUser, Job as PrismaJob, Company as PrismaCompany } from '@prisma/client';

// User Types
export type UserWithoutPassword = Omit<PrismaUser, 'password'>;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// API Response Types
export interface ApiSuccessResponse<T = any> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
    details?: string | object;
  };
  meta?: {
    timestamp: string;
    path: string;
  };
}

// Job with Relations
export type JobWithCompany = PrismaJob & {
  company: Pick<PrismaCompany, 'id' | 'name' | 'logo' | 'location' | 'industry'>;
  _count?: {
    applications: number;
  };
};

// Company with Relations
export type CompanyWithJobs = PrismaCompany & {
  jobs?: Array<Pick<PrismaJob, 'id' | 'title' | 'type' | 'location' | 'salary' | 'createdAt'>>;
  _count?: {
    jobs: number;
  };
};
