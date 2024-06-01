import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseHelperModule } from '../../../core/database'
import { QueueDomainFacade } from './queue.domain.facade'
import { Queue } from './queue.model'

@Module({
  imports: [TypeOrmModule.forFeature([Queue]), DatabaseHelperModule],
  providers: [QueueDomainFacade, QueueDomainFacade],
  exports: [QueueDomainFacade],
})
export class QueueDomainModule {}
