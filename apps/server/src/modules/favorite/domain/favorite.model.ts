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
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true })
  userId?: string

  @ManyToOne(() => User, parent => parent.favorites)
  @JoinColumn({ name: 'userId' })
  user?: User

  @Column({ nullable: true })
  queueId?: string

  @ManyToOne(() => Queue, parent => parent.favorites)
  @JoinColumn({ name: 'queueId' })
  queue?: Queue

  @CreateDateColumn()
  dateCreated: string

  @UpdateDateColumn()
  dateUpdated: string

  @DeleteDateColumn()
  dateDeleted: string
}
