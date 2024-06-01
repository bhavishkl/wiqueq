import { Notification } from '../notification'

import { Queue } from '../queue'

import { Participant } from '../participant'

import { Favorite } from '../favorite'

import { Booking } from '../booking'

import { Review } from '../review'

export enum UserStatus {
  CREATED = 'CREATED',
  VERIFIED = 'VERIFIED',
}
export class User {
  id: string
  email?: string
  status: UserStatus
  name?: string
  pictureUrl?: string
  password?: string
  dateCreated: string
  dateUpdated: string
  notifications?: Notification[]

  queuesAsServiceProvider?: Queue[]

  participants?: Participant[]

  favorites?: Favorite[]

  bookings?: Booking[]

  reviews?: Review[]
}
