import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Province } from './province.entity'
import { TourGuide } from './tourguide.entity'
import { User } from './user.entity'

@Entity({ name: 'user_requests' })
export class UserRequest {
  @PrimaryGeneratedColumn()
  id: number

  // report:
  @ManyToOne(() => User, (user) => user.requests)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Province, (province) => province.requests)
  @JoinColumn({ name: 'province_id' })
  province: TourGuide

  @Column({
    name: 'content',
    type: 'text',
  })
  content: string

  @Column({ name: 'start_date', type: 'date', nullable: false })
  startDate: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}
