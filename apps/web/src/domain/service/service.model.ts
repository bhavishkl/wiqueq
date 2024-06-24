// apps/web/src/domain/service/service.model.ts

import { Queue } from '../queue'

export class Service {
  id: string

  name: string

  queueId?: string

  queue?: Queue

  dateCreated: string

  dateDeleted: string

  dateUpdated: string
}
