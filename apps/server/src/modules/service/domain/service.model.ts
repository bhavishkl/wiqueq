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

import { Queue } from '../../../modules/queue/domain'

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({})
  serviceName: string

  @Column({ nullable: true })
  queueId?: string

  @ManyToOne(() => Queue, parent => parent.services)
  @JoinColumn({ name: 'queueId' })
  queue?: Queue

  @CreateDateColumn()
  dateCreated: string

  @UpdateDateColumn()
  dateUpdated: string

  @DeleteDateColumn()
  dateDeleted: string
}
