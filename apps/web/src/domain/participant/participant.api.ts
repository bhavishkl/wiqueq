import { HttpService } from '../../core/http'
import { ApiHelper } from '../helpers/api.helper'
import { Participant } from './participant.model'

export class ParticipantApi {
  static findMany(
    queryOptions?: ApiHelper.QueryOptions<Participant>,
  ): Promise<Participant[]> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(`/v1/participants${buildOptions}`)
  }

  static findOne(
    participantId: string,
    queryOptions?: ApiHelper.QueryOptions<Participant>,
  ): Promise<Participant> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(
      `/v1/participants/${participantId}${buildOptions}`,
    )
  }

  static createOne(values: Partial<Participant>): Promise<Participant> {
    return HttpService.api.post(`/v1/participants`, values)
  }

  static updateOne(
    participantId: string,
    values: Partial<Participant>,
  ): Promise<Participant> {
    return HttpService.api.patch(`/v1/participants/${participantId}`, values)
  }

  static deleteOne(participantId: string): Promise<void> {
    return HttpService.api.delete(`/v1/participants/${participantId}`)
  }

  static findManyByUserId(
    userId: string,
    queryOptions?: ApiHelper.QueryOptions<Participant>,
  ): Promise<Participant[]> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(
      `/v1/users/user/${userId}/participants${buildOptions}`,
    )
  }

  static createOneByUserId(
    userId: string,
    values: Partial<Participant>,
  ): Promise<Participant> {
    return HttpService.api.post(`/v1/users/user/${userId}/participants`, values)
  }

  static findManyByQueueId(
    queueId: string,
    queryOptions?: ApiHelper.QueryOptions<Participant>,
  ): Promise<Participant[]> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(
      `/v1/queues/queue/${queueId}/participants${buildOptions}`,
    )
  }

  static createOneByQueueId(
    queueId: string,
    values: Partial<Participant>,
  ): Promise<Participant> {
    return HttpService.api.post(
      `/v1/queues/queue/${queueId}/participants`,
      values,
    )
  }
}
