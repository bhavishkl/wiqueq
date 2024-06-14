import { ColumnNumeric } from '@server/core/database'
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

import { User } from '../../../modules/user/domain'

import { Participant } from '../../../modules/participant/domain'

import { Favorite } from '../../../modules/favorite/domain'

import { Booking } from '../../../modules/booking/domain'

import { Review } from '../../../modules/review/domain'

import { Service } from '../../../modules/service/domain'

@Entity()
export class Queue {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({})
  name: string

  @Column({ nullable: true })
  logoUrl?: string

  @Column({ nullable: true })
  description?: string

  @Column({ nullable: true })
  location?: string

  @Column({ nullable: true })
  category?: string

  @Column({ nullable: true })
  operatingHours?: string

  @Column({ nullable: true })
  contactPhone?: string

  @Column({ nullable: true })
  contactEmail?: string

  @Column({ nullable: true })
  pincode?: string

  @Column({ nullable: true })
  serviceProviderId?: string

  @ManyToOne(() => User, parent => parent.queuesAsServiceProvider)
  @JoinColumn({ name: 'serviceProviderId' })
  serviceProvider?: User

  @OneToMany(() => Participant, child => child.queue)
  participants?: Participant[]

  @OneToMany(() => Favorite, child => child.queue)
  favorites?: Favorite[]

  @OneToMany(() => Booking, child => child.queue)
  bookings?: Booking[]

  @OneToMany(() => Review, child => child.queue)
  reviews?: Review[]

  @OneToMany(() => Service, child => child.queue)
  services?: Service[]

  @Column({ nullable: true })
  averageTime?: string

  @CreateDateColumn()
  dateCreated: string

  @UpdateDateColumn()
  dateUpdated: string

  @DeleteDateColumn()
  dateDeleted: string
}
