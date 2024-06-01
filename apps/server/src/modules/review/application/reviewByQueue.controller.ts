import { Request } from 'express'

import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { RequestHelper } from '@server/helpers/request'
import { EventService } from '@server/libraries/event'
import { ReviewDomainFacade } from '@server/modules/review/domain'
import { AuthenticationDomainFacade } from '@server/modules/authentication/domain'
import { ReviewApplicationEvent } from './review.application.event'
import { ReviewCreateDto } from './review.dto'

import { QueueDomainFacade } from '../../queue/domain'

@Controller('/v1/queues')
export class ReviewByQueueController {
  constructor(
    private queueDomainFacade: QueueDomainFacade,

    private reviewDomainFacade: ReviewDomainFacade,
    private eventService: EventService,
    private authenticationDomainFacade: AuthenticationDomainFacade,
  ) {}

  @Get('/queue/:queueId/reviews')
  async findManyQueueId(
    @Param('queueId') queueId: string,
    @Req() request: Request,
  ) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const parent = await this.queueDomainFacade.findOneByIdOrFail(queueId)

    const items = await this.reviewDomainFacade.findManyByQueue(
      parent,
      queryOptions,
    )

    return items
  }

  @Post('/queue/:queueId/reviews')
  async createByQueueId(
    @Param('queueId') queueId: string,
    @Body() body: ReviewCreateDto,
    @Req() request: Request,
  ) {
    const { user } = this.authenticationDomainFacade.getRequestPayload(request)

    const valuesUpdated = { ...body, queueId }

    const item = await this.reviewDomainFacade.create(valuesUpdated)

    await this.eventService.emit<ReviewApplicationEvent.ReviewCreated.Payload>(
      ReviewApplicationEvent.ReviewCreated.key,
      {
        id: item.id,
        userId: user.id,
      },
    )

    return item
  }
}
