import { Module } from '@nestjs/common'
import { AuthenticationDomainModule } from '@server/modules/authentication/domain'
import { BookingDomainModule } from '../domain'
import { BookingController } from './booking.controller'

import { UserDomainModule } from '../../../modules/user/domain'

import { BookingByUserController } from './bookingByUser.controller'

import { QueueDomainModule } from '../../../modules/queue/domain'

import { BookingByQueueController } from './bookingByQueue.controller'

@Module({
  imports: [
    AuthenticationDomainModule,
    BookingDomainModule,

    UserDomainModule,

    QueueDomainModule,
  ],
  controllers: [
    BookingController,

    BookingByUserController,

    BookingByQueueController,
  ],
  providers: [],
})
export class BookingApplicationModule {}
