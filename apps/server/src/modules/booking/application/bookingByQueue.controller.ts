import { Request } from 'express'

import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { RequestHelper } from '@server/helpers/request'
import { EventService } from '@server/libraries/event'
import { BookingDomainFacade } from '@server/modules/booking/domain'
import { AuthenticationDomainFacade } from '@server/modules/authentication/domain'
import { BookingApplicationEvent } from './booking.application.event'
import { BookingCreateDto } from './booking.dto'

import { QueueDomainFacade } from '../../queue/domain'

@Controller('/v1/queues')
export class BookingByQueueController {
  constructor(
    private queueDomainFacade: QueueDomainFacade,

    private bookingDomainFacade: BookingDomainFacade,
    private eventService: EventService,
    private authenticationDomainFacade: AuthenticationDomainFacade,
  ) {}

  @Get('/queue/:queueId/bookings')
  async findManyQueueId(
    @Param('queueId') queueId: string,
    @Req() request: Request,
  ) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const parent = await this.queueDomainFacade.findOneByIdOrFail(queueId)

    const items = await this.bookingDomainFacade.findManyByQueue(
      parent,
      queryOptions,
    )

    return items
  }

  @Post('/queue/:queueId/bookings')
  async createByQueueId(
    @Param('queueId') queueId: string,
    @Body() body: BookingCreateDto,
    @Req() request: Request,
  ) {
    const { user } = this.authenticationDomainFacade.getRequestPayload(request)

    const valuesUpdated = { ...body, queueId }

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
