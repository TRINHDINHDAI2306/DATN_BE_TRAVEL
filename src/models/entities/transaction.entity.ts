import { TransactionStatus, TransactionType } from 'src/shares/enum/transaction.enum'
import { WALLET_TYPE } from 'src/shares/enum/wallet.enum'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Admin } from './admin.entity'
import { TourGuide } from './tourguide.entity'
import { User } from './user.entity'

@Entity({ name: 'transactions' })
export class TransactionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'transaction_code', type: 'varchar', nullable: true })
  transactionCode: string

  @Column({
    type: 'enum',
    enum: WALLET_TYPE,
    name: 'wallet',
    nullable: true,
    default: null,
  })
  wallet: WALLET_TYPE

  @Column({
    name: 'amount',
    default: 0,
    type: 'int',
    nullable: false,
  })
  amount: number

  @Column({
    name: 'status',
    type: 'enum',
    enum: TransactionStatus,
    nullable: false,
  })
  status: TransactionStatus

  @Column({
    type: 'enum',
    enum: TransactionType,
    name: 'type',
    nullable: false,
  })
  type: TransactionType

  @Column({
    type: 'datetime',
    name: 'time',
    nullable: true,
    default: null,
  })
  time: Date

  @ManyToOne(() => Admin, (admin) => admin.transactions)
  @JoinColumn({ name: 'admin_id' })
  admin: Admin

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => TourGuide, (tourguide) => tourguide.transactions)
  @JoinColumn({ name: 'tourguide_id' })
  tourGuide: TourGuide

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
