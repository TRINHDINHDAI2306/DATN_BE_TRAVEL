import { BasePaginationResponseDto } from 'src/shares/dtos/base-pagination.dto'
import { DiscountType, VoucherStatus } from 'src/shares/enum/voucher.enum'
import { EntityRepository, Repository } from 'typeorm'

import { Voucher } from '../entities/voucher.entity'

@EntityRepository(Voucher)
export class VoucherRepository extends Repository<Voucher> {
  async getVouchers(page: number, limit: number, discountType?: DiscountType | null, userId?: number) {
    console.log(page, limit)

    const queryBuilder = this.createQueryBuilder('voucher')
    queryBuilder
      .select('voucher.id', 'id')
      .addSelect('voucher.name', 'name')
      .addSelect('voucher.description', 'description')
      .addSelect('voucher.code', 'code')
      .addSelect('voucher.discountType', 'discountType')
      .addSelect('voucher.value', 'value')
      .addSelect('voucher.quantity', 'quantity')
      .addSelect('voucher.requirementPoint', 'requirementPoint')
      .addSelect('voucher.startDate', 'startDate')
      .addSelect('voucher.endDate', 'endDate')
      .addSelect('voucher.deletedAt', 'deletedAt')
      .addSelect('COUNT(DISTINCT userVouchers.id)', 'claimed')
      .leftJoin('voucher.userVouchers', 'userVouchers')
      .where('voucher.endDate > :endDate', {
        endDate: new Date().toISOString().slice(0, 10),
      })
      .andWhere('voucher.deletedAt is null')
      .andWhere('voucher.status = :voucherStatus', {
        voucherStatus: VoucherStatus.ACTIVE,
      })
      .groupBy('voucher.id')
      .orderBy('voucher.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    if (discountType) {
      queryBuilder.andWhere('voucher.discountType = :discountType', {
        discountType,
      })
    }
    if (userId) {
      queryBuilder.andWhere(
        `voucher.id NOT IN 
    (SELECT user_voucher.voucher_id FROM user_voucher WHERE user_voucher.user_id = :userId)`,
        {
          userId,
        },
      )
    }
    const [data, countData] = await Promise.all([queryBuilder.getRawMany(), queryBuilder.getCount()])

    return BasePaginationResponseDto.convertToPaginationWithTotalPages([data, countData], page || 1, limit || 10)
  }
}
