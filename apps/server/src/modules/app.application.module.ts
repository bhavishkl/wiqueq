import { Module } from '@nestjs/common'
import { AuthenticationApplicationModule } from './authentication/application'
import { AuthorizationApplicationModule } from './authorization/application'
import { UserApplicationModule } from './user/application'

import { QueueApplicationModule } from './queue/application'

import { ParticipantApplicationModule } from './participant/application'

import { FavoriteApplicationModule } from './favorite/application'

import { BookingApplicationModule } from './booking/application'

import { ReviewApplicationModule } from './review/application'

import { ServiceApplicationModule } from './service/application'

import { QueueCategoryApplicationModule } from './queueCategory/application'

import { AiApplicationModule } from './ai/application/ai.application.module'
import { BillingApplicationModule } from './billing/application'
import { NotificationApplicationModule } from './notification/application/notification.application.module'
import { UploadApplicationModule } from './upload/application/upload.application.module'

@Module({
  imports: [
    AuthenticationApplicationModule,
    UserApplicationModule,
    AuthorizationApplicationModule,
    NotificationApplicationModule,
    AiApplicationModule,
    UploadApplicationModule,
    BillingApplicationModule,

    QueueApplicationModule,

    ParticipantApplicationModule,

    FavoriteApplicationModule,

    BookingApplicationModule,

    ReviewApplicationModule,

    ServiceApplicationModule,

    QueueCategoryApplicationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppApplicationModule {}
