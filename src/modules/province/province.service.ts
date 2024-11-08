import { Injectable } from '@nestjs/common'
import { ProvinceRepository } from 'src/models/repositories/province.repository'
import { TourStatus } from 'src/shares/enum/tour.enum'
import { httpResponse } from 'src/shares/response'
import { Response } from 'src/shares/response/response.interface'

import { getProvinceDto } from './dto/get-province.dto'
@Injectable()
export class ProvinceService {
  constructor(private readonly provinceRepository: ProvinceRepository) {}

  async getProvinces(query: getProvinceDto): Promise<Response> {
    const keyword = query.keyword?.replace(/(%)/g, '\\$1')

    const queryBuilder = this.provinceRepository
      .createQueryBuilder('province')
      .leftJoinAndSelect('province.tours', 'tour', 'tour.status = :status', {
        status: TourStatus.ACTIVE,
      })
    if (keyword) {
      queryBuilder.where('province.name LIKE :keyword', {
        keyword: `%${keyword}%`,
      })
    }
    const provinces = await queryBuilder.getMany()

    return {
      ...httpResponse.GET_PROVINCE_SUCCESS,
      returnValue: provinces,
    }
  }

  async getTopProvinces(): Promise<Response> {
    const query = `
  SELECT provinces.*, COUNT(tours.id) AS tourCount
  FROM provinces
  LEFT JOIN tours ON tours.province_id = provinces.id AND tours.status = ?
  GROUP BY provinces.id
  ORDER BY tourCount DESC, provinces.num_of_favorites
  LIMIT 5
`

    const provinces = await this.provinceRepository.query(query, [TourStatus.ACTIVE])

    return {
      ...httpResponse.GET_PROVINCE_SUCCESS,
      returnValue: provinces,
    }
  }
}
