import { IsString, IsEnum, IsDate, IsInt, IsOptional, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum InterviewType {
  ONLINE = 'ONLINE',
  PHYSICAL = 'PHYSICAL',
}

export enum InterviewStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
}

export enum InterviewPlatform {
  ZOOM = 'ZOOM',
  GOOGLE_MEET = 'GOOGLE_MEET',
  TEAMS = 'TEAMS',
  SKYPE = 'SKYPE',
  OTHER = 'OTHER',
}

export class CreateInterviewDto {
  @IsString()
  @IsNotEmpty()
  applicationId: string;

  @IsEnum(InterviewType)
  type: InterviewType;

  @IsDate()
  @Type(() => Date)
  scheduledAt: Date;

  @IsInt()
  @Min(15)
  duration: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  meetingLink?: string;

  @IsEnum(InterviewPlatform)
  @IsOptional()
  platform?: InterviewPlatform;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateInterviewDto {
  @IsEnum(InterviewType)
  @IsOptional()
  type?: InterviewType;

  @IsEnum(InterviewStatus)
  @IsOptional()
  status?: InterviewStatus;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  scheduledAt?: Date;

  @IsInt()
  @Min(15)
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  meetingLink?: string;

  @IsEnum(InterviewPlatform)
  @IsOptional()
  platform?: InterviewPlatform;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class InterviewQueryDto {
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(InterviewStatus)
  status?: InterviewStatus;

  @IsOptional()
  @IsEnum(InterviewType)
  type?: InterviewType;
}
