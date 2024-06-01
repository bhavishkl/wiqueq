import { Request } from 'express'

import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { RequestHelper } from '@server/helpers/request'
import { EventService } from '@server/libraries/event'
import { ServiceDomainFacade } from '@server/modules/service/domain'
import { AuthenticationDomainFacade } from '@server/modules/authentication/domain'
import { ServiceApplicationEvent } from './service.application.event'
import { ServiceCreateDto } from './service.dto'

import { QueueDomainFacade } from '../../queue/domain'

@Controller('/v1/queues')
export class ServiceByQueueController {
  constructor(
    private queueDomainFacade: QueueDomainFacade,

    private serviceDomainFacade: ServiceDomainFacade,
    private eventService: EventService,
    private authenticationDomainFacade: AuthenticationDomainFacade,
  ) {}

  @Get('/queue/:queueId/services')
  async findManyQueueId(
    @Param('queueId') queueId: string,
    @Req() request: Request,
  ) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const parent = await this.queueDomainFacade.findOneByIdOrFail(queueId)

    const items = await this.serviceDomainFacade.findManyByQueue(
      parent,
      queryOptions,
    )

    return items
  }

  @Post('/queue/:queueId/services')
  async createByQueueId(
    @Param('queueId') queueId: string,
    @Body() body: ServiceCreateDto,
    @Req() request: Request,
  ) {
    const { user } = this.authenticationDomainFacade.getRequestPayload(request)

    const valuesUpdated = { ...body, queueId }

    const item = await this.serviceDomainFacade.create(valuesUpdated)

    await this.eventService.emit<ServiceApplicationEvent.ServiceCreated.Payload>(
      ServiceApplicationEvent.ServiceCreated.key,
      {
        id: item.id,
        userId: user.id,
      },
    )

    return item
  }
}
