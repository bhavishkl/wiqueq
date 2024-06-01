import { HttpService } from '../../core/http'
import { ApiHelper } from '../helpers/api.helper'
import { Booking } from './booking.model'

export class BookingApi {
  static findMany(
    queryOptions?: ApiHelper.QueryOptions<Booking>,
  ): Promise<Booking[]> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(`/v1/bookings${buildOptions}`)
  }

  static findOne(
    bookingId: string,
    queryOptions?: ApiHelper.QueryOptions<Booking>,
  ): Promise<Booking> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(`/v1/bookings/${bookingId}${buildOptions}`)
  }

  static createOne(values: Partial<Booking>): Promise<Booking> {
    return HttpService.api.post(`/v1/bookings`, values)
  }

  static updateOne(
    bookingId: string,
    values: Partial<Booking>,
  ): Promise<Booking> {
    return HttpService.api.patch(`/v1/bookings/${bookingId}`, values)
  }

  static deleteOne(bookingId: string): Promise<void> {
    return HttpService.api.delete(`/v1/bookings/${bookingId}`)
  }

  static findManyByUserId(
    userId: string,
    queryOptions?: ApiHelper.QueryOptions<Booking>,
  ): Promise<Booking[]> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(
      `/v1/users/user/${userId}/bookings${buildOptions}`,
    )
  }

  static createOneByUserId(
    userId: string,
    values: Partial<Booking>,
  ): Promise<Booking> {
    return HttpService.api.post(`/v1/users/user/${userId}/bookings`, values)
  }

  static findManyByQueueId(
    queueId: string,
    queryOptions?: ApiHelper.QueryOptions<Booking>,
  ): Promise<Booking[]> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(
      `/v1/queues/queue/${queueId}/bookings${buildOptions}`,
    )
  }

  static createOneByQueueId(
    queueId: string,
    values: Partial<Booking>,
  ): Promise<Booking> {
    return HttpService.api.post(`/v1/queues/queue/${queueId}/bookings`, values)
  }
}
