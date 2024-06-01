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
import {
  Participant,
  ParticipantDomainFacade,
} from '@server/modules/participant/domain'
import { AuthenticationDomainFacade } from '@server/modules/authentication/domain'
import { RequestHelper } from '../../../helpers/request'
import { ParticipantApplicationEvent } from './participant.application.event'
import { ParticipantCreateDto, ParticipantUpdateDto } from './participant.dto'

@Controller('/v1/participants')
export class ParticipantController {
  constructor(
    private eventService: EventService,
    private participantDomainFacade: ParticipantDomainFacade,
    private authenticationDomainFacade: AuthenticationDomainFacade,
  ) {}

  @Get('/')
  async findMany(@Req() request: Request) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const items = await this.participantDomainFacade.findMany(queryOptions)

    return items
  }

  @Post('/')
  async create(@Body() body: ParticipantCreateDto, @Req() request: Request) {
    const { user } = this.authenticationDomainFacade.getRequestPayload(request)

    const item = await this.participantDomainFacade.create(body)

    await this.eventService.emit<ParticipantApplicationEvent.ParticipantCreated.Payload>(
      ParticipantApplicationEvent.ParticipantCreated.key,
      {
        id: item.id,
        userId: user.id,
      },
    )

    return item
  }

  @Get('/:participantId')
  async findOne(
    @Param('participantId') participantId: string,
    @Req() request: Request,
  ) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const item = await this.participantDomainFacade.findOneByIdOrFail(
      participantId,
      queryOptions,
    )

    return item
  }

  @Patch('/:participantId')
  async update(
    @Param('participantId') participantId: string,
    @Body() body: ParticipantUpdateDto,
  ) {
    const item =
      await this.participantDomainFacade.findOneByIdOrFail(participantId)

    const itemUpdated = await this.participantDomainFacade.update(
      item,
      body as Partial<Participant>,
    )
    return itemUpdated
  }

  @Delete('/:participantId')
  async delete(@Param('participantId') participantId: string) {
    const item =
      await this.participantDomainFacade.findOneByIdOrFail(participantId)

    await this.participantDomainFacade.delete(item)

    return item
  }
}
