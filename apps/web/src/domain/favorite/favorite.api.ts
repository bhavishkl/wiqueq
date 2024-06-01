import { HttpService } from '../../core/http'
import { ApiHelper } from '../helpers/api.helper'
import { Favorite } from './favorite.model'

export class FavoriteApi {
  static findMany(
    queryOptions?: ApiHelper.QueryOptions<Favorite>,
  ): Promise<Favorite[]> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(`/v1/favorites${buildOptions}`)
  }

  static findOne(
    favoriteId: string,
    queryOptions?: ApiHelper.QueryOptions<Favorite>,
  ): Promise<Favorite> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(`/v1/favorites/${favoriteId}${buildOptions}`)
  }

  static createOne(values: Partial<Favorite>): Promise<Favorite> {
    return HttpService.api.post(`/v1/favorites`, values)
  }

  static updateOne(
    favoriteId: string,
    values: Partial<Favorite>,
  ): Promise<Favorite> {
    return HttpService.api.patch(`/v1/favorites/${favoriteId}`, values)
  }

  static deleteOne(favoriteId: string): Promise<void> {
    return HttpService.api.delete(`/v1/favorites/${favoriteId}`)
  }

  static findManyByUserId(
    userId: string,
    queryOptions?: ApiHelper.QueryOptions<Favorite>,
  ): Promise<Favorite[]> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(
      `/v1/users/user/${userId}/favorites${buildOptions}`,
    )
  }

  static createOneByUserId(
    userId: string,
    values: Partial<Favorite>,
  ): Promise<Favorite> {
    return HttpService.api.post(`/v1/users/user/${userId}/favorites`, values)
  }

  static findManyByQueueId(
    queueId: string,
    queryOptions?: ApiHelper.QueryOptions<Favorite>,
  ): Promise<Favorite[]> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(
      `/v1/queues/queue/${queueId}/favorites${buildOptions}`,
    )
  }

  static createOneByQueueId(
    queueId: string,
    values: Partial<Favorite>,
  ): Promise<Favorite> {
    return HttpService.api.post(`/v1/queues/queue/${queueId}/favorites`, values)
  }
}
