import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DatabaseHelper } from '../../../core/database'
import { RequestHelper } from '../../../helpers/request'
import { Service } from './service.model'

import { Queue } from '../../queue/domain'

@Injectable()
export class ServiceDomainFacade {
  constructor(
    @InjectRepository(Service)
    private repository: Repository<Service>,
    private databaseHelper: DatabaseHelper,
  ) {}

  async create(values: Partial<Service>): Promise<Service> {
    return this.repository.save(values)
  }

  async update(item: Service, values: Partial<Service>): Promise<Service> {
    const itemUpdated = { ...item, ...values }

    return this.repository.save(itemUpdated)
  }

  async delete(item: Service): Promise<void> {
    await this.repository.softDelete(item.id)
  }

  async findMany(
    queryOptions: RequestHelper.QueryOptions<Service> = {},
  ): Promise<Service[]> {
    const query = this.databaseHelper.applyQueryOptions(
      this.repository,
      queryOptions,
    )

    return query.getMany()
  }

  async findOneByIdOrFail(
    id: string,
    queryOptions: RequestHelper.QueryOptions<Service> = {},
  ): Promise<Service> {
    if (!id) {
      this.databaseHelper.invalidQueryWhere('id')
    }

    const queryOptionsEnsured = {
      includes: queryOptions?.includes,
      filters: {
        id: id,
      },
    }

    const query = this.databaseHelper.applyQueryOptions(
      this.repository,
      queryOptionsEnsured,
    )

    const item = await query.getOne()

    if (!item) {
      this.databaseHelper.notFoundByQuery(queryOptionsEnsured.filters)
    }

    return item
  }

  async findManyByQueue(
    item: Queue,
    queryOptions: RequestHelper.QueryOptions<Service> = {},
  ): Promise<Service[]> {
    if (!item) {
      this.databaseHelper.invalidQueryWhere('queue')
    }

    const queryOptionsEnsured = {
      includes: queryOptions.includes,
      orders: queryOptions.orders,
      filters: {
        ...queryOptions.filters,
        queueId: item.id,
      },
    }

    const query = this.databaseHelper.applyQueryOptions(
      this.repository,
      queryOptionsEnsured,
    )

    return query.getMany()
  }
}
