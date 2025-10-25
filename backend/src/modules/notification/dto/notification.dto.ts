import { IsOptional, IsBoolean, IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetNotificationsDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 20;

  @IsOptional()
  @IsEnum(['APPLICATION', 'JOB', 'INTERVIEW', 'SYSTEM'])
  type?: 'APPLICATION' | 'JOB' | 'INTERVIEW' | 'SYSTEM';

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  unreadOnly?: boolean;
}

export class MarkAsReadDto {
  @IsOptional()
  @IsString({ each: true })
  notificationIds?: string[];
}
