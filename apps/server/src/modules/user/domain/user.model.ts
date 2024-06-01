import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Notification } from '../../../modules/notification/domain'

import { Queue } from '../../../modules/queue/domain'

import { Participant } from '../../../modules/participant/domain'

import { Favorite } from '../../../modules/favorite/domain'

import { Booking } from '../../../modules/booking/domain'

import { Review } from '../../../modules/review/domain'

export enum UserStatus {
  VERIFIED = 'VERIFIED',
  CREATED = 'CREATED',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true, unique: true })
  email?: string

  @Column({ nullable: true })
  name?: string

  @Column({ nullable: true })
  pictureUrl?: string

  @Column({ nullable: true, select: false })
  stripeCustomerId?: string

  @Column({ nullable: true, select: false })
  password?: string

  @Column({ enum: UserStatus, default: UserStatus.VERIFIED })
  status: UserStatus

  @OneToMany(() => Queue, child => child.serviceProvider)
  queuesAsServiceProvider?: Queue[]

  @OneToMany(() => Participant, child => child.user)
  participants?: Participant[]

  @OneToMany(() => Favorite, child => child.user)
  favorites?: Favorite[]

  @OneToMany(() => Booking, child => child.user)
  bookings?: Booking[]

  @OneToMany(() => Review, child => child.user)
  reviews?: Review[]

  @OneToMany(() => Notification, notification => notification.user)
  notifications?: Notification[]

  @CreateDateColumn()
  dateCreated: string

  @UpdateDateColumn()
  dateUpdated: string

  @DeleteDateColumn()
  dateDeleted: string
}
