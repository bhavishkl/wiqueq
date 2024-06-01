import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseHelperModule } from '../../../core/database'
import { BookingDomainFacade } from './booking.domain.facade'
import { Booking } from './booking.model'

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), DatabaseHelperModule],
  providers: [BookingDomainFacade, BookingDomainFacade],
  exports: [BookingDomainFacade],
})
export class BookingDomainModule {}
