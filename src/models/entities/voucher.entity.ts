import { DiscountType, VoucherStatus } from 'src/shares/enum/voucher.enum'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { UserVoucher } from './user_voucher.entity'

@Entity({ name: 'vouchers' })
export class Voucher {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string

  @Column({
    name: 'description',
    type: 'varchar',
  })
  description: string

  @Column({
    name: 'code',
    type: 'varchar',
  })
  code: string

  @Column({
    name: 'discount_type',
    type: 'enum',
    enum: DiscountType,
    nullable: false,
  })
  discountType: DiscountType

  @Column({
    name: 'status',
    type: 'enum',
    enum: VoucherStatus,
    nullable: false,
    default: VoucherStatus.ACTIVE,
  })
  status: VoucherStatus

  @Column({
    name: 'value',
    type: 'int',
    nullable: false,
  })
  value: number

  @Column({
    name: 'quantity',
    type: 'int',
    nullable: false,
  })
  quantity: number

  @Column({
    name: 'requirement_point',
    type: 'int',
    default: 0,
    nullable: false,
  })
  requirementPoint: number

  @OneToMany(() => UserVoucher, (userVoucher) => userVoucher.voucher)
  userVouchers: UserVoucher[]

  @Column({ name: 'start_date', type: 'date', nullable: false })
  startDate: Date

  @Column({ name: 'end_date', type: 'date', nullable: false })
  endDate: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}
