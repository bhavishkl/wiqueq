import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class ServiceCreateDto {
  @IsString()
  @IsNotEmpty()
  serviceName: string

  @IsString()
  @IsNotEmpty()
  queueId: string
}


export class ServiceUpdateDto {
  @IsString()
  @IsOptional()
  serviceName?: string

  @IsString()
  @IsOptional()
  serviceDescription?: string

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
