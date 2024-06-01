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
import { Favorite, FavoriteDomainFacade } from '@server/modules/favorite/domain'
import { AuthenticationDomainFacade } from '@server/modules/authentication/domain'
import { RequestHelper } from '../../../helpers/request'
import { FavoriteApplicationEvent } from './favorite.application.event'
import { FavoriteCreateDto, FavoriteUpdateDto } from './favorite.dto'

@Controller('/v1/favorites')
export class FavoriteController {
  constructor(
    private eventService: EventService,
    private favoriteDomainFacade: FavoriteDomainFacade,
    private authenticationDomainFacade: AuthenticationDomainFacade,
  ) {}

  @Get('/')
  async findMany(@Req() request: Request) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const items = await this.favoriteDomainFacade.findMany(queryOptions)

    return items
  }

  @Post('/')
  async create(@Body() body: FavoriteCreateDto, @Req() request: Request) {
    const { user } = this.authenticationDomainFacade.getRequestPayload(request)

    const item = await this.favoriteDomainFacade.create(body)

    await this.eventService.emit<FavoriteApplicationEvent.FavoriteCreated.Payload>(
      FavoriteApplicationEvent.FavoriteCreated.key,
      {
        id: item.id,
        userId: user.id,
      },
    )

    return item
  }

  @Get('/:favoriteId')
  async findOne(
    @Param('favoriteId') favoriteId: string,
    @Req() request: Request,
  ) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const item = await this.favoriteDomainFacade.findOneByIdOrFail(
      favoriteId,
      queryOptions,
    )

    return item
  }

  @Patch('/:favoriteId')
  async update(
    @Param('favoriteId') favoriteId: string,
    @Body() body: FavoriteUpdateDto,
  ) {
    const item = await this.favoriteDomainFacade.findOneByIdOrFail(favoriteId)

    const itemUpdated = await this.favoriteDomainFacade.update(
      item,
      body as Partial<Favorite>,
    )
    return itemUpdated
  }

  @Delete('/:favoriteId')
  async delete(@Param('favoriteId') favoriteId: string) {
    const item = await this.favoriteDomainFacade.findOneByIdOrFail(favoriteId)

    await this.favoriteDomainFacade.delete(item)

    return item
  }
}
