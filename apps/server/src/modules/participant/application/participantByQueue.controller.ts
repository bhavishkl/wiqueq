import { Request } from 'express'

import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { RequestHelper } from '@server/helpers/request'
import { EventService } from '@server/libraries/event'
import { ParticipantDomainFacade } from '@server/modules/participant/domain'
import { AuthenticationDomainFacade } from '@server/modules/authentication/domain'
import { ParticipantApplicationEvent } from './participant.application.event'
import { ParticipantCreateDto } from './participant.dto'

import { QueueDomainFacade } from '../../queue/domain'

@Controller('/v1/queues')
export class ParticipantByQueueController {
  constructor(
    private queueDomainFacade: QueueDomainFacade,

    private participantDomainFacade: ParticipantDomainFacade,
    private eventService: EventService,
    private authenticationDomainFacade: AuthenticationDomainFacade,
  ) {}

  @Get('/queue/:queueId/participants')
  async findManyQueueId(
    @Param('queueId') queueId: string,
    @Req() request: Request,
  ) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const parent = await this.queueDomainFacade.findOneByIdOrFail(queueId)

    const items = await this.participantDomainFacade.findManyByQueue(
      parent,
      queryOptions,
    )

    return items
  }

  @Post('/queue/:queueId/participants')
  async createByQueueId(
    @Param('queueId') queueId: string,
    @Body() body: ParticipantCreateDto,
    @Req() request: Request,
  ) {
    const { user } = this.authenticationDomainFacade.getRequestPayload(request)

    const valuesUpdated = { ...body, queueId }

    const item = await this.participantDomainFacade.create(valuesUpdated)

    await this.eventService.emit<ParticipantApplicationEvent.ParticipantCreated.Payload>(
      ParticipantApplicationEvent.ParticipantCreated.key,
      {
        id: item.id,
        userId: user.id,
      },
    )

    return item
  }
}
