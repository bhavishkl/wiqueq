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
  QueueCategory,
  QueueCategoryDomainFacade,
} from '@server/modules/queueCategory/domain'
import { AuthenticationDomainFacade } from '@server/modules/authentication/domain'
import { RequestHelper } from '../../../helpers/request'
import { QueueCategoryApplicationEvent } from './queueCategory.application.event'
import {
  QueueCategoryCreateDto,
  QueueCategoryUpdateDto,
} from './queueCategory.dto'

@Controller('/v1/queueCategorys')
export class QueueCategoryController {
  constructor(
    private eventService: EventService,
    private queueCategoryDomainFacade: QueueCategoryDomainFacade,
    private authenticationDomainFacade: AuthenticationDomainFacade,
  ) {}

  @Get('/')
  async findMany(@Req() request: Request) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const items = await this.queueCategoryDomainFacade.findMany(queryOptions)

    return items
  }

  @Post('/')
  async create(@Body() body: QueueCategoryCreateDto, @Req() request: Request) {
    const { user } = this.authenticationDomainFacade.getRequestPayload(request)

    const item = await this.queueCategoryDomainFacade.create(body)

    await this.eventService.emit<QueueCategoryApplicationEvent.QueueCategoryCreated.Payload>(
      QueueCategoryApplicationEvent.QueueCategoryCreated.key,
      {
        id: item.id,
        userId: user.id,
      },
    )

    return item
  }

  @Get('/:queueCategoryId')
  async findOne(
    @Param('queueCategoryId') queueCategoryId: string,
    @Req() request: Request,
  ) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const item = await this.queueCategoryDomainFacade.findOneByIdOrFail(
      queueCategoryId,
      queryOptions,
    )

    return item
  }

  @Patch('/:queueCategoryId')
  async update(
    @Param('queueCategoryId') queueCategoryId: string,
    @Body() body: QueueCategoryUpdateDto,
  ) {
    const item =
      await this.queueCategoryDomainFacade.findOneByIdOrFail(queueCategoryId)

    const itemUpdated = await this.queueCategoryDomainFacade.update(
      item,
      body as Partial<QueueCategory>,
    )
    return itemUpdated
  }

  @Delete('/:queueCategoryId')
  async delete(@Param('queueCategoryId') queueCategoryId: string) {
    const item =
      await this.queueCategoryDomainFacade.findOneByIdOrFail(queueCategoryId)

    await this.queueCategoryDomainFacade.delete(item)

    return item
  }
}
