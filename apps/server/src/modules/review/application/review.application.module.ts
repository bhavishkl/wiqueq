import { Module } from '@nestjs/common'
import { AuthenticationDomainModule } from '@server/modules/authentication/domain'
import { ReviewDomainModule } from '../domain'
import { ReviewController } from './review.controller'

import { UserDomainModule } from '../../../modules/user/domain'

import { ReviewByUserController } from './reviewByUser.controller'

import { QueueDomainModule } from '../../../modules/queue/domain'

import { ReviewByQueueController } from './reviewByQueue.controller'

@Module({
  imports: [
    AuthenticationDomainModule,
    ReviewDomainModule,

    UserDomainModule,

    QueueDomainModule,
  ],
  controllers: [
    ReviewController,

    ReviewByUserController,

    ReviewByQueueController,
  ],
  providers: [],
})
export class ReviewApplicationModule {}
