import { Module } from '@nestjs/common'
import { SocketModule } from '@server/libraries/socket'
import { AuthorizationDomainModule } from '@server/modules/authorization/domain'
import { NotificationDomainModule } from '../domain'

import { NotificationQueueSubscriber } from './subscribers/notification.queue.subscriber'

import { NotificationParticipantSubscriber } from './subscribers/notification.participant.subscriber'

import { NotificationFavoriteSubscriber } from './subscribers/notification.favorite.subscriber'

import { NotificationBookingSubscriber } from './subscribers/notification.booking.subscriber'

import { NotificationReviewSubscriber } from './subscribers/notification.review.subscriber'

import { NotificationServiceSubscriber } from './subscribers/notification.service.subscriber'

import { NotificationQueueCategorySubscriber } from './subscribers/notification.queueCategory.subscriber'

@Module({
  imports: [AuthorizationDomainModule, NotificationDomainModule, SocketModule],
  providers: [
    NotificationQueueSubscriber,

    NotificationParticipantSubscriber,

    NotificationFavoriteSubscriber,

    NotificationBookingSubscriber,

    NotificationReviewSubscriber,

    NotificationServiceSubscriber,

    NotificationQueueCategorySubscriber,
  ],
  exports: [],
})
export class NotificationInfrastructureModule {}
