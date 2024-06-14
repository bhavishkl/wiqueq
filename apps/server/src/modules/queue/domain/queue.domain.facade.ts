import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DatabaseHelper } from '../../../core/database'
import { RequestHelper } from '../../../helpers/request'
import { Queue } from './queue.model'

import { User } from '../../user/domain'

@Injectable()
export class QueueDomainFacade {
  constructor(
    @InjectRepository(Queue)
    private repository: Repository<Queue>,
    private databaseHelper: DatabaseHelper,
  ) {}

  async create(values: Partial<Queue>): Promise<Queue> {
    if (values.averageTime) {
      values.averageTime = values.averageTime.toString();
    }
    return this.repository.save(values)
  }

  async update(item: Queue, values: Partial<Queue>): Promise<Queue> {
    if (values.averageTime) {
      values.averageTime = values.averageTime.toString();
    }
    const itemUpdated = { ...item, ...values }

    return this.repository.save(itemUpdated)
  }

  async delete(item: Queue): Promise<void> {
    await this.repository.softDelete(item.id)
  }

  async findMany(
    queryOptions: RequestHelper.QueryOptions<Queue> = {},
  ): Promise<Queue[]> {
    const query = this.databaseHelper.applyQueryOptions(
      this.repository,
      queryOptions,
    )

    return query.getMany()
  }

  async findOneByIdOrFail(
    id: string,
    queryOptions: RequestHelper.QueryOptions<Queue> = {},
  ): Promise<Queue> {
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

  async findManyByServiceProvider(
    item: User,
    queryOptions: RequestHelper.QueryOptions<Queue> = {},
  ): Promise<Queue[]> {
    if (!item) {
      this.databaseHelper.invalidQueryWhere('serviceProvider')
    }

    const queryOptionsEnsured = {
      includes: queryOptions.includes,
      orders: queryOptions.orders,
      filters: {
        ...queryOptions.filters,
        serviceProviderId: item.id,
      },
    }

    const query = this.databaseHelper.applyQueryOptions(
      this.repository,
      queryOptionsEnsured,
    )

    return query.getMany()
  }
}
