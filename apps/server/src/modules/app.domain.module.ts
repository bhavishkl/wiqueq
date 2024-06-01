import { Module } from '@nestjs/common'
import { AuthenticationDomainModule } from './authentication/domain'
import { AuthorizationDomainModule } from './authorization/domain'

import { UserDomainModule } from './user/domain'

import { NotificationDomainModule } from './notification/domain'

import { QueueDomainModule } from './queue/domain'

import { ParticipantDomainModule } from './participant/domain'

import { FavoriteDomainModule } from './favorite/domain'

import { BookingDomainModule } from './booking/domain'

import { ReviewDomainModule } from './review/domain'

import { ServiceDomainModule } from './service/domain'

import { QueueCategoryDomainModule } from './queueCategory/domain'

@Module({
  imports: [
    AuthenticationDomainModule,
    AuthorizationDomainModule,
    UserDomainModule,
    NotificationDomainModule,

    QueueDomainModule,

    ParticipantDomainModule,

    FavoriteDomainModule,

    BookingDomainModule,

    ReviewDomainModule,

    ServiceDomainModule,

    QueueCategoryDomainModule,
  ],
  controllers: [],
  providers: [],
})
export class AppDomainModule {}
