import * as moment from 'moment'
import { GetTourGuideDto } from 'src/modules/tourguide/dto/get-tour-guide.dto'
import { BasePaginationResponseDto } from 'src/shares/dtos/base-pagination.dto'
import { Direction, OrderStatus } from 'src/shares/enum/order.enum'
import { TourguideStatus } from 'src/shares/enum/tourguide.enum'
import { TransactionStatus } from 'src/shares/enum/transaction.enum'
import { EntityRepository, Repository } from 'typeorm'

import { TourGuide } from '../entities/tourguide.entity'

@EntityRepository(TourGuide)
export class TourGuideRepository extends Repository<TourGuide> {
  async getTourGuidesByStatusAndKeyword(keyword: string, status: TourguideStatus, page: number, limit: number) {
    const queryBuilder = this.createQueryBuilder('tourGuide')

    if (keyword) {
      const keywordLike = `%${keyword}%`
      queryBuilder
        .where('tourGuide.email LIKE :keyword')
        .orWhere('tourGuide.username LIKE :keyword')
        .orWhere('tourGuide.name LIKE :keyword')
        .orWhere('tourGuide.id LIKE :keyword')
        .setParameters({ keyword: keywordLike })
    }

    queryBuilder
      .andWhere('tourGuide.verifyStatus = :status', { status })
      .orderBy('tourGuide.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    return queryBuilder.getManyAndCount()
  }

  async getTourGuides(getTourGuideDto: GetTourGuideDto) {
    const { limit, page, provinces, gender, keyword, totalTourDirection, totalFavorite } = getTourGuideDto

    const query = this.createQueryBuilder('tourguide')
      .leftJoinAndSelect('tourguide.provinces', 'province')
      .leftJoinAndSelect('tourguide.userFavorites', 'userFavorites')
      .leftJoinAndSelect(
        'tourguide.orders',
        'orders',
        'orders.status = :status AND orders.tourGuideId = tourguide.id',
        {
          status: OrderStatus.DONE,
        },
      )
      .leftJoinAndSelect('orders.tour', 'tour')
      .leftJoinAndSelect('tour.rates', 'rates')
      .select([
        'tourguide.id As tourGuideId',
        'tourguide.username as tourGuideUsername',
        'tourguide.bio as tourGuideBio',
        'tourguide.avatar as tourGuideAvatar',
        'tourguide.email as tourGuideEmail',
        'tourguide.phone as tourGuidePhone',
        'tourguide.name as tourGuideName',
        'province.name as provinceName',
        'tourguide.gender as tourGuideGender',
        'tourguide.dob as tourGuideDob',
        'tourguide.status as tourGuideStatus',
        'tourguide.num_of_favorites as numOfFavorites',
        'COUNT(DISTINCT orders.id) AS totalTour',
        'COUNT(DISTINCT userFavorites.id) AS totalFavorite',
        'AVG(rates.star) as star',
      ])
      .andWhere('tourguide.status = "ACTIVE"')
      .groupBy('tourguide.id')
    if (gender) {
      query.andWhere('tourguide.gender = :gender', { gender })
    }
    if (provinces) {
      query.andWhere('province.id = :id', { id: provinces })
    }

    if (keyword) {
      query.andWhere(
        '(tourguide.username LIKE :keyword OR tourguide.name LIKE :keyword OR tourguide.email LIKE :keyword)',
        { keyword: `%${keyword}%` },
      )
    }

    if (totalTourDirection && !totalFavorite) {
      if (totalTourDirection === Direction.DESC) {
        query.orderBy('totalTour', Direction.DESC)
      } else {
        query.orderBy('totalTour', Direction.ASC)
      }
    }

    if (totalFavorite && !totalTourDirection) {
      if (totalFavorite === Direction.DESC) {
        query.orderBy('totalFavorite', Direction.DESC)
      } else {
        query.orderBy('totalFavorite', Direction.ASC)
      }
    }
    query.orderBy('tourguide.cancelledOrders', Direction.ASC)
    const [data, countData] = await Promise.all([query.getRawMany(), query.getCount()])

    return BasePaginationResponseDto.convertToPaginationWithTotalPages([data, countData], page || 1, limit || 10)
  }

  async getAvgStar(tourGuideId) {
    const avgStar = await this.createQueryBuilder('tourguide')
      .leftJoin('tourguide.tours', 'tours')
      .leftJoin('tours.rates', 'rate')
      .select('AVG(rate.star)', 'avgStar')
      .where('tours.tourGuideId = :tourGuideId', { tourGuideId })
      .getRawOne()
    return avgStar
  }

  async getTotalIncome(monthAgo: boolean = false): Promise<number> {
    const queryBuilder = this.createQueryBuilder('transaction')
    queryBuilder.select('SUM(transaction.amount)', 'totalAmount')
    queryBuilder.where('transaction.status = :status', {
      status: TransactionStatus.SUCCESS,
    })

    if (monthAgo) {
      const oneMonthAgo = moment().subtract(1, 'month').startOf('day').toDate()
      queryBuilder.andWhere('transaction.time >= :monthAgo', {
        monthAgo: oneMonthAgo,
      })
    }

    const result = await queryBuilder.getRawOne()
    const totalAmount = result ? result.totalAmount : 0
    return totalAmount
  }
}
