import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { BasePaginationRequestDto } from 'src/shares/dtos/base-pagination.dto'

export class GetUserRequestDto extends BasePaginationRequestDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  provinceId: string
}
