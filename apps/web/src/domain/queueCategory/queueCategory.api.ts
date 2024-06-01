import { HttpService } from '../../core/http'
import { ApiHelper } from '../helpers/api.helper'
import { QueueCategory } from './queueCategory.model'

export class QueueCategoryApi {
  static findMany(
    queryOptions?: ApiHelper.QueryOptions<QueueCategory>,
  ): Promise<QueueCategory[]> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(`/v1/queueCategorys${buildOptions}`)
  }

  static findOne(
    queueCategoryId: string,
    queryOptions?: ApiHelper.QueryOptions<QueueCategory>,
  ): Promise<QueueCategory> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(
      `/v1/queueCategorys/${queueCategoryId}${buildOptions}`,
    )
  }

  static createOne(values: Partial<QueueCategory>): Promise<QueueCategory> {
    return HttpService.api.post(`/v1/queueCategorys`, values)
  }

  static updateOne(
    queueCategoryId: string,
    values: Partial<QueueCategory>,
  ): Promise<QueueCategory> {
    return HttpService.api.patch(
      `/v1/queueCategorys/${queueCategoryId}`,
      values,
    )
  }

  static deleteOne(queueCategoryId: string): Promise<void> {
    return HttpService.api.delete(`/v1/queueCategorys/${queueCategoryId}`)
  }
}
