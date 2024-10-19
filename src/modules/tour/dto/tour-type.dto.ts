import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { TourTypes } from 'src/shares/enum/tour.enum'

export class TourTypesDto {
  @ApiProperty({ required: false })
  @IsEnum(TourTypes)
  @IsNotEmpty()
  type: TourTypes
}
