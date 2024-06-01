import { HttpService } from '../../core/http'
import { ApiHelper } from '../helpers/api.helper'
import { Service } from './service.model'

export class ServiceApi {
  static findMany(
    queryOptions?: ApiHelper.QueryOptions<Service>,
  ): Promise<Service[]> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(`/v1/services${buildOptions}`)
  }

  static findOne(
    serviceId: string,
    queryOptions?: ApiHelper.QueryOptions<Service>,
  ): Promise<Service> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(`/v1/services/${serviceId}${buildOptions}`)
  }

  static createOne(values: Partial<Service>): Promise<Service> {
    return HttpService.api.post(`/v1/services`, values)
  }

  static updateOne(
    serviceId: string,
    values: Partial<Service>,
  ): Promise<Service> {
    return HttpService.api.patch(`/v1/services/${serviceId}`, values)
  }

  static deleteOne(serviceId: string): Promise<void> {
    return HttpService.api.delete(`/v1/services/${serviceId}`)
  }

  static findManyByQueueId(
    queueId: string,
    queryOptions?: ApiHelper.QueryOptions<Service>,
  ): Promise<Service[]> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(
      `/v1/queues/queue/${queueId}/services${buildOptions}`,
    )
  }

  static createOneByQueueId(
    queueId: string,
    values: Partial<Service>,
  ): Promise<Service> {
    return HttpService.api.post(`/v1/queues/queue/${queueId}/services`, values)
  }
}
