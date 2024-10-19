import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class getProvinceDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  keyword: string
}
