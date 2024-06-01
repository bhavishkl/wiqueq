import { User } from '../user'

import { Queue } from '../queue'

export class Review {
  id: string

  rating?: number

  reviewText?: string

  reviewTime?: string

  userId?: string

  user?: User

  queueId?: string

  queue?: Queue

  dateCreated: string

  dateDeleted: string

  dateUpdated: string
}
