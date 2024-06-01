import { Request } from 'express'

import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { RequestHelper } from '@server/helpers/request'
import { EventService } from '@server/libraries/event'
import { FavoriteDomainFacade } from '@server/modules/favorite/domain'
import { AuthenticationDomainFacade } from '@server/modules/authentication/domain'
import { FavoriteApplicationEvent } from './favorite.application.event'
import { FavoriteCreateDto } from './favorite.dto'

import { QueueDomainFacade } from '../../queue/domain'

@Controller('/v1/queues')
export class FavoriteByQueueController {
  constructor(
    private queueDomainFacade: QueueDomainFacade,

    private favoriteDomainFacade: FavoriteDomainFacade,
    private eventService: EventService,
    private authenticationDomainFacade: AuthenticationDomainFacade,
  ) {}

  @Get('/queue/:queueId/favorites')
  async findManyQueueId(
    @Param('queueId') queueId: string,
    @Req() request: Request,
  ) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const parent = await this.queueDomainFacade.findOneByIdOrFail(queueId)

    const items = await this.favoriteDomainFacade.findManyByQueue(
      parent,
      queryOptions,
    )

    return items
  }

  @Post('/queue/:queueId/favorites')
  async createByQueueId(
    @Param('queueId') queueId: string,
    @Body() body: FavoriteCreateDto,
    @Req() request: Request,
  ) {
    const { user } = this.authenticationDomainFacade.getRequestPayload(request)

    const valuesUpdated = { ...body, queueId }

    const item = await this.favoriteDomainFacade.create(valuesUpdated)

    await this.eventService.emit<FavoriteApplicationEvent.FavoriteCreated.Payload>(
      FavoriteApplicationEvent.FavoriteCreated.key,
      {
        id: item.id,
        userId: user.id,
      },
    )

    return item
  }
}
