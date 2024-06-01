import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class ParticipantCreateDto {
  @IsNumber()
  @IsOptional()
  position?: number

  @IsString()
  @IsOptional()
  joinTime?: string

  @IsString()
  @IsOptional()
  leaveTime?: string

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

export class ParticipantUpdateDto {
  @IsNumber()
  @IsOptional()
  position?: number

  @IsString()
  @IsOptional()
  joinTime?: string

  @IsString()
  @IsOptional()
  leaveTime?: string

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
