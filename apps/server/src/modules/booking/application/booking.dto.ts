import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class BookingCreateDto {
  @IsString()
  @IsOptional()
  bookingTime?: string

  @IsString()
  @IsOptional()
  service?: string

  @IsString()
  @IsOptional()
  status?: string

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

export class BookingUpdateDto {
  @IsString()
  @IsOptional()
  bookingTime?: string

  @IsString()
  @IsOptional()
  service?: string

  @IsString()
  @IsOptional()
  status?: string

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
