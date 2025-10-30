import { IsString, IsOptional, IsUrl, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(20)
  description: string;

  @IsString()
  industry: string;

  @IsString()
  size: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  founded?: string;

  @IsOptional()
  @IsString()
  logo?: string;
}

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(20)
  description?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  founded?: string;

  @IsOptional()
  @IsString()
  logo?: string;
}
