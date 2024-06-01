import { Module } from '@nestjs/common'
import { AuthenticationDomainModule } from '@server/modules/authentication/domain'
import { ServiceDomainModule } from '../domain'
import { ServiceController } from './service.controller'

import { QueueDomainModule } from '../../../modules/queue/domain'

import { ServiceByQueueController } from './serviceByQueue.controller'

@Module({
  imports: [AuthenticationDomainModule, ServiceDomainModule, QueueDomainModule],
  controllers: [ServiceController, ServiceByQueueController],
  providers: [],
})
export class ServiceApplicationModule {}
