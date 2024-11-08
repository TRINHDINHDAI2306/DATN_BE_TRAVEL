import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import * as moment from 'moment'
import { UserVoucher } from 'src/models/entities/user_voucher.entity'
import { Voucher } from 'src/models/entities/voucher.entity'
import { UserVoucherRepository } from 'src/models/repositories/user-voucher.repository'
import { UserRepository } from 'src/models/repositories/user.repository'
import { VoucherRepository } from 'src/models/repositories/voucher.repository'
import { UserStatus } from 'src/shares/enum/user.enum'
import { UserVoucherStatus, VoucherStatus } from 'src/shares/enum/voucher.enum'
import { httpErrors } from 'src/shares/exceptions'
import { httpResponse } from 'src/shares/response'
import { Response } from 'src/shares/response/response.interface'

import { CreateVoucherDto } from './dto/create-voucher.dto'
import { GetVoucherDto } from './dto/get-voucher.dto'

@Injectable()
export class VoucherService {
  constructor(
    private readonly voucherRepository: VoucherRepository,
    private readonly userRepository: UserRepository,
    private readonly userVoucherRepository: UserVoucherRepository,
  ) {}

  async createVoucher(createVoucherDto: CreateVoucherDto): Promise<Response> {
    const {
      name,
      startDate,
      endDate,
      quantity,
      value,
      requirementPoint: requirementPrice,
      discountType,
      code,
    } = createVoucherDto

    // Check if voucher with the same name already exists
    const existingVoucher = await this.voucherRepository.findOne({
      where: { name },
    })
    if (existingVoucher) {
      throw new HttpException(httpErrors.VOUCHER_EXIST, HttpStatus.FOUND)
    }

    // Create voucher
    const voucher = new Voucher()
    voucher.name = name
    voucher.code = code
    voucher.discountType = discountType
    voucher.requirementPoint = requirementPrice
    voucher.quantity = quantity
    voucher.value = value
    voucher.startDate = moment(startDate).toDate()
    voucher.endDate = moment(endDate).toDate()

    await this.voucherRepository.save(voucher)
    return httpResponse.CREATE_VOUCHER_SUCCESS
  }

  async getAllVoucher(options: GetVoucherDto, userId: number | null) {
    const { discountType, limit, page } = options
    let data
    if (discountType) {
      data = await this.voucherRepository.getVouchers(limit, page, discountType, userId)
    } else {
      data = await this.voucherRepository.getVouchers(page, limit, null, userId)
    }

    return {
      returnValue: data,
      ...httpResponse.GET_VOUCHER_SUCCESS,
    }
  }

  async claimVoucher(voucherId: number, userId: number) {
    const [user, voucher] = await Promise.all([
      this.userRepository.findOne({
        where: {
          id: userId,
          verifyStatus: UserStatus.ACTIVE,
        },
      }),
      this.voucherRepository.findOne(voucherId, {
        relations: ['userVouchers'],
      }),
    ])
    const currentDate = new Date()
    if (currentDate > voucher.endDate) {
      throw new HttpException(httpErrors.VOUCHER_EXPIRED, HttpStatus.BAD_REQUEST)
    }
    if (!user) {
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND)
    }
    if (!voucher) {
      throw new HttpException(httpErrors.VOUCHER_NOT_FOUND, HttpStatus.NOT_FOUND)
    }
    if (+user.voucherPoint < +voucher.requirementPoint) {
      throw new HttpException(httpErrors.NOT_ENOUGHT_VOUCHER_POINT, HttpStatus.BAD_REQUEST)
    }
    if (+voucher.quantity - voucher.userVouchers.length < 1) {
      throw new HttpException(httpErrors.VOUCHER_NOT_ENOUGH, HttpStatus.BAD_REQUEST)
    }
    // Check if the user has already claimed the voucher
    const existingUserVoucher = await this.userVoucherRepository.findOne({
      where: { user, voucher },
    })
    if (existingUserVoucher) {
      throw new HttpException(httpErrors.VOUCHER_ALREADY_CLAIM, HttpStatus.BAD_REQUEST)
    }
    if (+voucher.quantity - voucher.userVouchers.length - 1 === 0) {
      await this.voucherRepository.update({ id: voucherId }, { status: VoucherStatus.INACTIVE })
    }
    // Create a new user voucher
    const userVoucher = new UserVoucher()
    userVoucher.user = user
    userVoucher.voucher = voucher
    userVoucher.status = UserVoucherStatus.AVAILABLE

    await Promise.all([
      this.userRepository.update(userId, {
        voucherPoint:
          +voucher.requirementPoint === 0 ? voucher.requirementPoint : +user.voucherPoint - voucher.requirementPoint,
      }),
      this.userVoucherRepository.save(userVoucher),
    ])

    return httpResponse.CLAIM_VOUCHER_SUCCESS
  }

  async getAllAvailableVouchersForUser(userId: number): Promise<Response> {
    // Retrieve the user from the database
    const user = await this.userRepository.findOne(userId)

    if (!user) {
      throw new HttpException(httpErrors.USER_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    // Retrieve all user vouchers with status 'AVAILABLE' for the user
    const userVouchers = await this.userVoucherRepository.find({
      where: { user, status: UserVoucherStatus.AVAILABLE },
      relations: ['voucher'],
    })

    // Extract the vouchers from the user vouchers
    const vouchers = userVouchers.map((userVoucher) => userVoucher.voucher)

    return { returnValue: vouchers, ...httpResponse.GET_VOUCHER_SUCCESS }
  }
}
