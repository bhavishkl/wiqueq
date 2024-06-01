import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseHelperModule } from '../../../core/database'
import { ServiceDomainFacade } from './service.domain.facade'
import { Service } from './service.model'

@Module({
  imports: [TypeOrmModule.forFeature([Service]), DatabaseHelperModule],
  providers: [ServiceDomainFacade, ServiceDomainFacade],
  exports: [ServiceDomainFacade],
})
export class ServiceDomainModule {}
