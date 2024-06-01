import { Request } from 'express'

import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { RequestHelper } from '@server/helpers/request'
import { EventService } from '@server/libraries/event'
import { BookingDomainFacade } from '@server/modules/booking/domain'
import { AuthenticationDomainFacade } from '@server/modules/authentication/domain'
import { BookingApplicationEvent } from './booking.application.event'
import { BookingCreateDto } from './booking.dto'

import { UserDomainFacade } from '../../user/domain'

@Controller('/v1/users')
export class BookingByUserController {
  constructor(
    private userDomainFacade: UserDomainFacade,

    private bookingDomainFacade: BookingDomainFacade,
    private eventService: EventService,
    private authenticationDomainFacade: AuthenticationDomainFacade,
  ) {}

  @Get('/user/:userId/bookings')
  async findManyUserId(
    @Param('userId') userId: string,
    @Req() request: Request,
  ) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const parent = await this.userDomainFacade.findOneByIdOrFail(userId)

    const items = await this.bookingDomainFacade.findManyByUser(
      parent,
      queryOptions,
    )

    return items
  }

  @Post('/user/:userId/bookings')
  async createByUserId(
    @Param('userId') userId: string,
    @Body() body: BookingCreateDto,
    @Req() request: Request,
  ) {
    const { user } = this.authenticationDomainFacade.getRequestPayload(request)

    const valuesUpdated = { ...body, userId }

    const item = await this.bookingDomainFacade.create(valuesUpdated)

    await this.eventService.emit<BookingApplicationEvent.BookingCreated.Payload>(
      BookingApplicationEvent.BookingCreated.key,
      {
        id: item.id,
        userId: user.id,
      },
    )

    return item
  }
}
