import { Queue } from '../queue'

export class Service {
  id: string

  serviceName: string

  serviceDescription?: string

  queueId?: string

  queue?: Queue

  dateCreated: string

  dateDeleted: string

  dateUpdated: string
}
