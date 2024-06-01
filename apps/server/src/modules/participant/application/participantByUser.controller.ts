import { Request } from 'express'

import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { RequestHelper } from '@server/helpers/request'
import { EventService } from '@server/libraries/event'
import { ParticipantDomainFacade } from '@server/modules/participant/domain'
import { AuthenticationDomainFacade } from '@server/modules/authentication/domain'
import { ParticipantApplicationEvent } from './participant.application.event'
import { ParticipantCreateDto } from './participant.dto'

import { UserDomainFacade } from '../../user/domain'

@Controller('/v1/users')
export class ParticipantByUserController {
  constructor(
    private userDomainFacade: UserDomainFacade,

    private participantDomainFacade: ParticipantDomainFacade,
    private eventService: EventService,
    private authenticationDomainFacade: AuthenticationDomainFacade,
  ) {}

  @Get('/user/:userId/participants')
  async findManyUserId(
    @Param('userId') userId: string,
    @Req() request: Request,
  ) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const parent = await this.userDomainFacade.findOneByIdOrFail(userId)

    const items = await this.participantDomainFacade.findManyByUser(
      parent,
      queryOptions,
    )

    return items
  }

  @Post('/user/:userId/participants')
  async createByUserId(
    @Param('userId') userId: string,
    @Body() body: ParticipantCreateDto,
    @Req() request: Request,
  ) {
    const { user } = this.authenticationDomainFacade.getRequestPayload(request)

    const valuesUpdated = { ...body, userId }

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
