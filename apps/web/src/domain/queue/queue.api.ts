import { HttpService } from '../../core/http'
import { ApiHelper } from '../helpers/api.helper'
import { Queue } from './queue.model'

export class QueueApi {
  static findMany(
    queryOptions?: ApiHelper.QueryOptions<Queue>,
  ): Promise<Queue[]> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(`/v1/queues${buildOptions}`)
  }

  static findOne(
    queueId: string,
    queryOptions?: ApiHelper.QueryOptions<Queue>,
  ): Promise<Queue> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(`/v1/queues/${queueId}${buildOptions}`)
  }

  static createOne(values: Partial<Queue>): Promise<Queue> {
    return HttpService.api.post(`/v1/queues`, values)
  }

  static updateOne(queueId: string, values: Partial<Queue>): Promise<Queue> {
    return HttpService.api.patch(`/v1/queues/${queueId}`, values)
  }

  static deleteOne(queueId: string): Promise<void> {
    return HttpService.api.delete(`/v1/queues/${queueId}`)
  }

  static findManyByServiceProviderId(
    serviceProviderId: string,
    queryOptions?: ApiHelper.QueryOptions<Queue>,
  ): Promise<Queue[]> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(
      `/v1/users/serviceProvider/${serviceProviderId}/queues${buildOptions}`,
    )
  }

  static createOneByServiceProviderId(
    serviceProviderId: string,
    values: Partial<Queue>,
  ): Promise<Queue> {
    return HttpService.api.post(
      `/v1/users/serviceProvider/${serviceProviderId}/queues`,
      values,
    )
  }
}
