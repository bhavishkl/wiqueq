import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class ReviewCreateDto {
  @IsNumber()
  @IsOptional()
  rating?: number

  @IsString()
  @IsOptional()
  reviewText?: string

  @IsString()
  @IsOptional()
  reviewTime?: string

  @IsString()
  @IsOptional()
  userId?: string

  @IsString()
  @IsOptional()
  queueId?: string

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

export class ReviewUpdateDto {
  @IsNumber()
  @IsOptional()
  rating?: number

  @IsString()
  @IsOptional()
  reviewText?: string

  @IsString()
  @IsOptional()
  reviewTime?: string

  @IsString()
  @IsOptional()
  userId?: string

  @IsString()
  @IsOptional()
  queueId?: string

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
