import { User } from '../user'

import { Queue } from '../queue'

export class Favorite {
  id: string

  userId?: string

  user?: User

  queueId?: string

  queue?: Queue

  dateCreated: string

  dateDeleted: string

  dateUpdated: string
}
