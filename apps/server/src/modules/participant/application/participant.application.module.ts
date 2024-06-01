import { Module } from '@nestjs/common'
import { AuthenticationDomainModule } from '@server/modules/authentication/domain'
import { ParticipantDomainModule } from '../domain'
import { ParticipantController } from './participant.controller'

import { UserDomainModule } from '../../../modules/user/domain'

import { ParticipantByUserController } from './participantByUser.controller'

import { QueueDomainModule } from '../../../modules/queue/domain'

import { ParticipantByQueueController } from './participantByQueue.controller'

@Module({
  imports: [
    AuthenticationDomainModule,
    ParticipantDomainModule,

    UserDomainModule,

    QueueDomainModule,
  ],
  controllers: [
    ParticipantController,

    ParticipantByUserController,

    ParticipantByQueueController,
  ],
  providers: [],
})
export class ParticipantApplicationModule {}
