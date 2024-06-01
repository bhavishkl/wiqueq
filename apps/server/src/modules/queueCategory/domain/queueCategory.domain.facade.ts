import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DatabaseHelper } from '../../../core/database'
import { RequestHelper } from '../../../helpers/request'
import { QueueCategory } from './queueCategory.model'

@Injectable()
export class QueueCategoryDomainFacade {
  constructor(
    @InjectRepository(QueueCategory)
    private repository: Repository<QueueCategory>,
    private databaseHelper: DatabaseHelper,
  ) {}

  async create(values: Partial<QueueCategory>): Promise<QueueCategory> {
    return this.repository.save(values)
  }

  async update(
    item: QueueCategory,
    values: Partial<QueueCategory>,
  ): Promise<QueueCategory> {
    const itemUpdated = { ...item, ...values }

    return this.repository.save(itemUpdated)
  }

  async delete(item: QueueCategory): Promise<void> {
    await this.repository.softDelete(item.id)
  }

  async findMany(
    queryOptions: RequestHelper.QueryOptions<QueueCategory> = {},
  ): Promise<QueueCategory[]> {
    const query = this.databaseHelper.applyQueryOptions(
      this.repository,
      queryOptions,
    )

    return query.getMany()
  }

  async findOneByIdOrFail(
    id: string,
    queryOptions: RequestHelper.QueryOptions<QueueCategory> = {},
  ): Promise<QueueCategory> {
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
}
