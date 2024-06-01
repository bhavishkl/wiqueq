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
import { Queue, QueueDomainFacade } from '@server/modules/queue/domain'
import { AuthenticationDomainFacade } from '@server/modules/authentication/domain'
import { RequestHelper } from '../../../helpers/request'
import { QueueApplicationEvent } from './queue.application.event'
import { QueueCreateDto, QueueUpdateDto } from './queue.dto'

@Controller('/v1/queues')
export class QueueController {
  constructor(
    private eventService: EventService,
    private queueDomainFacade: QueueDomainFacade,
    private authenticationDomainFacade: AuthenticationDomainFacade,
  ) {}

  @Get('/')
  async findMany(@Req() request: Request) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const items = await this.queueDomainFacade.findMany(queryOptions)

    return items
  }

  @Post('/')
  async create(@Body() body: QueueCreateDto, @Req() request: Request) {
    const { user } = this.authenticationDomainFacade.getRequestPayload(request)

    const item = await this.queueDomainFacade.create(body)

    await this.eventService.emit<QueueApplicationEvent.QueueCreated.Payload>(
      QueueApplicationEvent.QueueCreated.key,
      {
        id: item.id,
        userId: user.id,
      },
    )

    return item
  }

  @Get('/:queueId')
  async findOne(@Param('queueId') queueId: string, @Req() request: Request) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const item = await this.queueDomainFacade.findOneByIdOrFail(
      queueId,
      queryOptions,
    )

    return item
  }

  @Patch('/:queueId')
  async update(
    @Param('queueId') queueId: string,
    @Body() body: QueueUpdateDto,
  ) {
    const item = await this.queueDomainFacade.findOneByIdOrFail(queueId)

    const itemUpdated = await this.queueDomainFacade.update(
      item,
      body as Partial<Queue>,
    )
    return itemUpdated
  }

  @Delete('/:queueId')
  async delete(@Param('queueId') queueId: string) {
    const item = await this.queueDomainFacade.findOneByIdOrFail(queueId)

    await this.queueDomainFacade.delete(item)

    return item
  }
}
