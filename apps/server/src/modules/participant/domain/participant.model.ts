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
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ColumnNumeric({ nullable: true, type: 'numeric' })
  position?: number

  @Column({ nullable: true })
  joinTime?: string

  @Column({ nullable: true })
  leaveTime?: string

  @Column({ nullable: true })
  status?: string

  @Column({ nullable: true })
  userId?: string

  @ManyToOne(() => User, parent => parent.participants)
  @JoinColumn({ name: 'userId' })
  user?: User

  @Column({ nullable: true })
  queueId?: string

  @ManyToOne(() => Queue, parent => parent.participants)
  @JoinColumn({ name: 'queueId' })
  queue?: Queue

  @CreateDateColumn()
  dateCreated: string

  @UpdateDateColumn()
  dateUpdated: string

  @DeleteDateColumn()
  dateDeleted: string
}
