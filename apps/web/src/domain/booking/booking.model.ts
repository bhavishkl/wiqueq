import { User } from '../user'

import { Queue } from '../queue'

export class Booking {
  id: string

  bookingTime?: string

  service?: string

  status?: string

  userId?: string

  user?: User

  queueId?: string

  queue?: Queue

  dateCreated: string

  dateDeleted: string

  dateUpdated: string
}
