import {
  IsString,
  IsArray,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsDateString,
  MinLength,
} from 'class-validator';
import { JobType } from '@prisma/client';

export class CreateJobDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(20)
  description: string;

  @IsArray()
  @IsString({ each: true })
  requirements: string[];

  @IsArray()
  @IsString({ each: true })
  responsibilities: string[];

  @IsArray()
  @IsString({ each: true })
  benefits: string[];

  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsEnum(JobType)
  type: JobType;

  @IsString()
  experience: string;

  @IsString()
  salary: string;

  @IsString()
  location: string;

  @IsBoolean()
  @IsOptional()
  isRemote?: boolean;

  @IsString()
  category: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;
}

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(20)
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  responsibilities?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsEnum(JobType)
  type?: JobType;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  salary?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsBoolean()
  isRemote?: boolean;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;
}

export class JobQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(JobType)
  type?: JobType;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsString()
  salaryRange?: string;

  @IsOptional()
  @IsBoolean()
  isRemote?: boolean;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
