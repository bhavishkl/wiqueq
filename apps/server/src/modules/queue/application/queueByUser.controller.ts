import { Request } from 'express'

import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { RequestHelper } from '@server/helpers/request'
import { EventService } from '@server/libraries/event'
import { QueueDomainFacade } from '@server/modules/queue/domain'
import { AuthenticationDomainFacade } from '@server/modules/authentication/domain'
import { QueueApplicationEvent } from './queue.application.event'
import { QueueCreateDto } from './queue.dto'

import { UserDomainFacade } from '../../user/domain'

@Controller('/v1/users')
export class QueueByUserController {
  constructor(
    private userDomainFacade: UserDomainFacade,

    private queueDomainFacade: QueueDomainFacade,
    private eventService: EventService,
    private authenticationDomainFacade: AuthenticationDomainFacade,
  ) {}

  @Get('/serviceProvider/:serviceProviderId/queues')
  async findManyServiceProviderId(
    @Param('serviceProviderId') serviceProviderId: string,
    @Req() request: Request,
  ) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const parent =
      await this.userDomainFacade.findOneByIdOrFail(serviceProviderId)

    const items = await this.queueDomainFacade.findManyByServiceProvider(
      parent,
      queryOptions,
    )

    return items
  }

  @Post('/serviceProvider/:serviceProviderId/queues')
  async createByServiceProviderId(
    @Param('serviceProviderId') serviceProviderId: string,
    @Body() body: QueueCreateDto,
    @Req() request: Request,
  ) {
    const { user } = this.authenticationDomainFacade.getRequestPayload(request)

    const valuesUpdated = { ...body, serviceProviderId }

    const item = await this.queueDomainFacade.create(valuesUpdated)

    await this.eventService.emit<QueueApplicationEvent.QueueCreated.Payload>(
      QueueApplicationEvent.QueueCreated.key,
      {
        id: item.id,
        userId: user.id,
      },
    )

    return item
  }
}
