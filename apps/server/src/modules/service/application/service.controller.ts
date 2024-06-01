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
import { Service, ServiceDomainFacade } from '@server/modules/service/domain'
import { AuthenticationDomainFacade } from '@server/modules/authentication/domain'
import { RequestHelper } from '../../../helpers/request'
import { ServiceApplicationEvent } from './service.application.event'
import { ServiceCreateDto, ServiceUpdateDto } from './service.dto'

@Controller('/v1/services')
export class ServiceController {
  constructor(
    private eventService: EventService,
    private serviceDomainFacade: ServiceDomainFacade,
    private authenticationDomainFacade: AuthenticationDomainFacade,
  ) {}

  @Get('/')
  async findMany(@Req() request: Request) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const items = await this.serviceDomainFacade.findMany(queryOptions)

    return items
  }

  @Post('/')
  async create(@Body() body: ServiceCreateDto, @Req() request: Request) {
    const { user } = this.authenticationDomainFacade.getRequestPayload(request)

    const item = await this.serviceDomainFacade.create(body)

    await this.eventService.emit<ServiceApplicationEvent.ServiceCreated.Payload>(
      ServiceApplicationEvent.ServiceCreated.key,
      {
        id: item.id,
        userId: user.id,
      },
    )

    return item
  }

  @Get('/:serviceId')
  async findOne(
    @Param('serviceId') serviceId: string,
    @Req() request: Request,
  ) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const item = await this.serviceDomainFacade.findOneByIdOrFail(
      serviceId,
      queryOptions,
    )

    return item
  }

  @Patch('/:serviceId')
  async update(
    @Param('serviceId') serviceId: string,
    @Body() body: ServiceUpdateDto,
  ) {
    const item = await this.serviceDomainFacade.findOneByIdOrFail(serviceId)

    const itemUpdated = await this.serviceDomainFacade.update(
      item,
      body as Partial<Service>,
    )
    return itemUpdated
  }

  @Delete('/:serviceId')
  async delete(@Param('serviceId') serviceId: string) {
    const item = await this.serviceDomainFacade.findOneByIdOrFail(serviceId)

    await this.serviceDomainFacade.delete(item)

    return item
  }
}
