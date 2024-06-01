import { Module } from '@nestjs/common'
import { AuthenticationDomainModule } from '@server/modules/authentication/domain'
import { QueueDomainModule } from '../domain'
import { QueueController } from './queue.controller'

import { UserDomainModule } from '../../../modules/user/domain'

import { QueueByUserController } from './queueByUser.controller'

@Module({
  imports: [AuthenticationDomainModule, QueueDomainModule, UserDomainModule],
  controllers: [QueueController, QueueByUserController],
  providers: [],
})
export class QueueApplicationModule {}
