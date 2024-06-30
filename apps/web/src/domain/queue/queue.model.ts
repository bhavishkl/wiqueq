import { User } from '../user'

import { Participant } from '../participant'

import { Favorite } from '../favorite'

import { Booking } from '../booking'

import { Review } from '../review'

import { Service } from '../service'

export class Queue {
  id: string

  name: string

  logoUrl?: string

  description?: string

  location?: string

  category?: string

  operatingHours?: string

  contactPhone?: string

  contactEmail?: string

  pincode?: string

  serviceProviderId?: string

  serviceProvider?: User

  dateCreated: string

  dateDeleted: string

  dateUpdated: string

  participants?: Participant[]

  favorites?: Favorite[]

  bookings?: Booking[]

  reviews?: Review[]

  services?: Service[]

  averageTime?: string // Added missing property
  
  operatingDays?: string[] // Added missing property

  city?: string; // Add the city property
}
