import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'system' })
export class SystemEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'int',
    default: 0,
    name: 'balance',
    unsigned: true,
  })
  balance: number

  @Column({
    type: 'int',
    default: 10,
    name: 'commission',
    unsigned: true,
  })
  commission: number

  @Column({
    type: 'int',
    default: 100,
    name: 'return_user_percent',
    unsigned: true,
  })
  returnUserPercent: number

  @Column({
    type: 'int',
    default: 10,
    name: 'tourguide_prepaid_order',
    unsigned: true,
  })
  tourGuidePrepaidOrder: number

  @Column({
    type: 'int',
    default: 3,
    name: 'warning_time',
    unsigned: true,
  })
  warningTime: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
