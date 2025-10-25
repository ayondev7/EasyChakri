import { User as PrismaUser, Job as PrismaJob, Company as PrismaCompany } from '@prisma/client';

export type UserWithoutPassword = Omit<PrismaUser, 'password'>;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

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

export type JobWithCompany = PrismaJob & {
  company: Pick<PrismaCompany, 'id' | 'name' | 'logo' | 'location' | 'industry'>;
  _count?: {
    applications: number;
  };
};

export type CompanyWithJobs = PrismaCompany & {
  jobs?: Array<Pick<PrismaJob, 'id' | 'title' | 'type' | 'location' | 'salary' | 'createdAt'>>;
  _count?: {
    jobs: number;
  };
};
