import { Request } from 'express'

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common'
import { EventService } from '@server/libraries/event'
import { Booking, BookingDomainFacade } from '@server/modules/booking/domain'
import { AuthenticationDomainFacade } from '@server/modules/authentication/domain'
import { RequestHelper } from '../../../helpers/request'
import { BookingApplicationEvent } from './booking.application.event'
import { BookingCreateDto, BookingUpdateDto } from './booking.dto'

@Controller('/v1/bookings')
export class BookingController {
  constructor(
    private eventService: EventService,
    private bookingDomainFacade: BookingDomainFacade,
    private authenticationDomainFacade: AuthenticationDomainFacade,
  ) {}

  @Get('/')
  async findMany(@Req() request: Request) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const items = await this.bookingDomainFacade.findMany(queryOptions)

    return items
  }

  @Post('/')
  async create(@Body() body: BookingCreateDto, @Req() request: Request) {
    const { user } = this.authenticationDomainFacade.getRequestPayload(request)

    const item = await this.bookingDomainFacade.create(body)

    await this.eventService.emit<BookingApplicationEvent.BookingCreated.Payload>(
      BookingApplicationEvent.BookingCreated.key,
      {
        id: item.id,
        userId: user.id,
      },
    )

    return item
  }

  @Get('/:bookingId')
  async findOne(
    @Param('bookingId') bookingId: string,
    @Req() request: Request,
  ) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const item = await this.bookingDomainFacade.findOneByIdOrFail(
      bookingId,
      queryOptions,
    )

    return item
  }

  @Patch('/:bookingId')
  async update(
    @Param('bookingId') bookingId: string,
    @Body() body: BookingUpdateDto,
  ) {
    const item = await this.bookingDomainFacade.findOneByIdOrFail(bookingId)

    const itemUpdated = await this.bookingDomainFacade.update(
      item,
      body as Partial<Booking>,
    )
    return itemUpdated
  }

  @Delete('/:bookingId')
  async delete(@Param('bookingId') bookingId: string) {
    const item = await this.bookingDomainFacade.findOneByIdOrFail(bookingId)

    await this.bookingDomainFacade.delete(item)

    return item
  }
}
