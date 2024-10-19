import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

export class CreateMeetingReportDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  reportId: number

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  meetingDate: Date
}
