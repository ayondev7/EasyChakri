import { 
  IsString, 
  IsOptional, 
  IsArray, 
  IsUrl, 
  MinLength, 
  MaxLength,
  IsNotEmpty,
  ValidateIf
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @ValidateIf((o) => o.name !== undefined && o.name !== null)
  @IsString({ message: 'Name must be a text value' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name?: string;

  @IsOptional()
  @ValidateIf((o) => o.phone !== undefined && o.phone !== null)
  @IsString({ message: 'Phone must be a text value' })
  @MinLength(10, { message: 'Phone number must be at least 10 characters' })
  @MaxLength(20, { message: 'Phone number must not exceed 20 characters' })
  phone?: string;

  @IsOptional()
  @ValidateIf((o) => o.location !== undefined && o.location !== null)
  @IsString({ message: 'Location must be a text value' })
  @MinLength(2, { message: 'Location must be at least 2 characters long' })
  @MaxLength(200, { message: 'Location must not exceed 200 characters' })
  location?: string;

  @IsOptional()
  @ValidateIf((o) => o.bio !== undefined && o.bio !== null)
  @IsString({ message: 'Bio must be a text value' })
  @MaxLength(1000, { message: 'Bio must not exceed 1000 characters' })
  bio?: string;

  @IsOptional()
  @ValidateIf((o) => o.skills !== undefined && o.skills !== null)
  @IsArray({ message: 'Skills must be a list of text values' })
  @IsString({ each: true, message: 'Each skill must be a text value' })
  skills?: string[];

  @IsOptional()
  @ValidateIf((o) => o.experience !== undefined && o.experience !== null)
  @IsString({ message: 'Experience must be a text value' })
  @MaxLength(2000, { message: 'Experience must not exceed 2000 characters' })
  experience?: string;

  @IsOptional()
  @ValidateIf((o) => o.education !== undefined && o.education !== null)
  @IsString({ message: 'Education must be a text value' })
  @MaxLength(2000, { message: 'Education must not exceed 2000 characters' })
  education?: string;

  @IsOptional()
  @ValidateIf((o) => o.image !== undefined && o.image !== null)
  @IsString({ message: 'Image must be a valid URL' })
  image?: string;

  @IsOptional()
  @ValidateIf((o) => o.resume !== undefined && o.resume !== null)
  @IsUrl({}, { message: 'Resume must be a valid URL' })
  resume?: string;
}
