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

import { Queue } from '../../../modules/queue/domain'

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true })
  bookingTime?: string

  @Column({ nullable: true })
  service?: string

  @Column({ nullable: true })
  status?: string

  @Column({ nullable: true })
  userId?: string

  @ManyToOne(() => User, parent => parent.bookings)
  @JoinColumn({ name: 'userId' })
  user?: User

  @Column({ nullable: true })
  queueId?: string

  @ManyToOne(() => Queue, parent => parent.bookings)
  @JoinColumn({ name: 'queueId' })
  queue?: Queue

  @CreateDateColumn()
  dateCreated: string

  @UpdateDateColumn()
  dateUpdated: string

  @DeleteDateColumn()
  dateDeleted: string
}
