import { HttpService } from '../../core/http'
import { ApiHelper } from '../helpers/api.helper'
import { Review } from './review.model'

export class ReviewApi {
  static findMany(
    queryOptions?: ApiHelper.QueryOptions<Review>,
  ): Promise<Review[]> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(`/v1/reviews${buildOptions}`)
  }

  static findOne(
    reviewId: string,
    queryOptions?: ApiHelper.QueryOptions<Review>,
  ): Promise<Review> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(`/v1/reviews/${reviewId}${buildOptions}`)
  }

  static createOne(values: Partial<Review>): Promise<Review> {
    return HttpService.api.post(`/v1/reviews`, values)
  }

  static updateOne(reviewId: string, values: Partial<Review>): Promise<Review> {
    return HttpService.api.patch(`/v1/reviews/${reviewId}`, values)
  }

  static deleteOne(reviewId: string): Promise<void> {
    return HttpService.api.delete(`/v1/reviews/${reviewId}`)
  }

  static findManyByUserId(
    userId: string,
    queryOptions?: ApiHelper.QueryOptions<Review>,
  ): Promise<Review[]> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(
      `/v1/users/user/${userId}/reviews${buildOptions}`,
    )
  }

  static createOneByUserId(
    userId: string,
    values: Partial<Review>,
  ): Promise<Review> {
    return HttpService.api.post(`/v1/users/user/${userId}/reviews`, values)
  }

  static findManyByQueueId(
    queueId: string,
    queryOptions?: ApiHelper.QueryOptions<Review>,
  ): Promise<Review[]> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(
      `/v1/queues/queue/${queueId}/reviews${buildOptions}`,
    )
  }

  static createOneByQueueId(
    queueId: string,
    values: Partial<Review>,
  ): Promise<Review> {
    return HttpService.api.post(`/v1/queues/queue/${queueId}/reviews`, values)
  }
}
