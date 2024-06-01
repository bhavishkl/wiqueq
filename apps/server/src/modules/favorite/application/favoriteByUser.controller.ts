import { Request } from 'express'

import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { RequestHelper } from '@server/helpers/request'
import { EventService } from '@server/libraries/event'
import { FavoriteDomainFacade } from '@server/modules/favorite/domain'
import { AuthenticationDomainFacade } from '@server/modules/authentication/domain'
import { FavoriteApplicationEvent } from './favorite.application.event'
import { FavoriteCreateDto } from './favorite.dto'

import { UserDomainFacade } from '../../user/domain'

@Controller('/v1/users')
export class FavoriteByUserController {
  constructor(
    private userDomainFacade: UserDomainFacade,

    private favoriteDomainFacade: FavoriteDomainFacade,
    private eventService: EventService,
    private authenticationDomainFacade: AuthenticationDomainFacade,
  ) {}

  @Get('/user/:userId/favorites')
  async findManyUserId(
    @Param('userId') userId: string,
    @Req() request: Request,
  ) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const parent = await this.userDomainFacade.findOneByIdOrFail(userId)

    const items = await this.favoriteDomainFacade.findManyByUser(
      parent,
      queryOptions,
    )

    return items
  }

  @Post('/user/:userId/favorites')
  async createByUserId(
    @Param('userId') userId: string,
    @Body() body: FavoriteCreateDto,
    @Req() request: Request,
  ) {
    const { user } = this.authenticationDomainFacade.getRequestPayload(request)

    const valuesUpdated = { ...body, userId }

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
