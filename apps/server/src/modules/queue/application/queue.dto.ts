import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class QueueCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  averageTime: string

  @IsString()
  @IsOptional()
  logoUrl?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  location?: string

  @IsString()
  @IsOptional()
  category?: string

  @IsString()
  @IsOptional()
  operatingHours?: string

  @IsString()
  @IsOptional()
  contactPhone?: string

  @IsString()
  @IsOptional()
  contactEmail?: string

  @IsString()
  @IsOptional()
  pincode?: string

  @IsString()
  @IsOptional()
  serviceProviderId?: string

  @IsString()
  @IsOptional()
  dateCreated?: string

  @IsString()
  @IsOptional()
  dateDeleted?: string

  @IsString()
  @IsOptional()
  dateUpdated?: string
}

export class QueueUpdateDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  averageTime?: string

  @IsString()
  @IsOptional()
  logoUrl?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  location?: string

  @IsString()
  @IsOptional()
  category?: string

  @IsString()
  @IsOptional()
  operatingHours?: string

  @IsString()
  @IsOptional()
  contactPhone?: string

  @IsString()
  @IsOptional()
  contactEmail?: string

  @IsString()
  @IsOptional()
  pincode?: string

  @IsString()
  @IsOptional()
  serviceProviderId?: string

  @IsString()
  @IsOptional()
  dateCreated?: string

  @IsString()
  @IsOptional()
  dateDeleted?: string

  @IsString()
  @IsOptional()
  dateUpdated?: string
}
