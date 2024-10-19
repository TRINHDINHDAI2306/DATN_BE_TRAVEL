import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ActorID } from 'src/shares/decorators/get-user-id.decorator'
import { Response } from 'src/shares/response/response.interface'

import { AdminModAuthGuard } from '../auth/guards/admin-mod-auth.guard'
import { TourGuideAuthGuard } from '../auth/guards/tour-guide-auth.guard'

import { ApproveTourDto } from './dto/approve-tour.dto'
import { CreateTourDto } from './dto/create-tour.dto'
import { GetTourDto } from './dto/get-tour.dto'
import { TourService } from './tour.service'

@Controller('tours')
@ApiTags('Tour')
@ApiBearerAuth()
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Post('/')
  @UseGuards(TourGuideAuthGuard)
  async createTour(@Body() body: CreateTourDto, @ActorID() tourGuideId: number): Promise<Response> {
    return this.tourService.createTour(body, tourGuideId)
  }

  // @Put('/active')
  // @UseGuards()

  @Get('/')
  async getTour(@Query() options: GetTourDto): Promise<Response> {
    return this.tourService.getTours(options)
  }

  @Get('/:id')
  async getOneTour(@Param('id') id: number) {
    return this.tourService.getTour(id)
  }

  @Get('/admin/approve-list')
  @UseGuards(AdminModAuthGuard)
  async getApproveList(@Query() options: GetTourDto): Promise<Response> {
    return this.tourService.getApproveList(options)
  }

  @Put('/')
  @UseGuards(AdminModAuthGuard)
  async approveTour(@Body() body: ApproveTourDto): Promise<Response> {
    return this.tourService.approveTour(body)
  }
}
