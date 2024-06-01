import { User } from '../user'

import { Queue } from '../queue'

export class Participant {
  id: string

  position?: number

  joinTime?: string

  leaveTime?: string

  status?: string

  userId?: string

  user?: User

  queueId?: string

  queue?: Queue

  dateCreated: string

  dateDeleted: string

  dateUpdated: string
}
