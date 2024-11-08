import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ActorID } from 'src/shares/decorators/get-user-id.decorator'
import { Response } from 'src/shares/response/response.interface'

import { AdminModAuthGuard } from '../auth/guards/admin-mod-auth.guard'
import { UserAuthGuard } from '../auth/guards/user-auth.guard'

import { GetReportDto } from './dto/get-report.dto'
import { HandleReportPostDto } from './dto/handle-report-post.dto'
import { CreateMeetingReportDto } from './dto/meeting-report.dto'
import { ReportPostDto } from './dto/report-post.dto'
import { ReportOrderDto } from './dto/report-tourguide.dto'
import { ReportService } from './report.service'

@Controller('reports')
@ApiTags('Report')
@ApiBearerAuth()
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('/post')
  @UseGuards(UserAuthGuard)
  async createPostReport(@Body() body: ReportPostDto, @ActorID() userId: number): Promise<Response> {
    return this.reportService.reportPost(body, userId)
  }

  @Post('/tourguide')
  @UseGuards(UserAuthGuard)
  async createTourguideReport(@Body() body: ReportOrderDto, @ActorID() userId: number): Promise<Response> {
    return this.reportService.reportOrder(body, userId)
  }

  @Get('/admin/post')
  @UseGuards(AdminModAuthGuard)
  async getReportPost(@Query() options: GetReportDto): Promise<Response> {
    return this.reportService.getReportPost(options)
  }

  @Get('/admin/tourguide')
  @UseGuards(AdminModAuthGuard)
  async getReportTourguide(@Query() options: GetReportDto): Promise<Response> {
    return this.reportService.getReportTourguide(options)
  }

  @Put('/admin/post')
  @UseGuards(AdminModAuthGuard)
  async handleReportPost(@Body() body: HandleReportPostDto): Promise<Response> {
    return this.reportService.handleReportPost(body)
  }

  @Put('/admin/tourguide-meeting')
  @UseGuards(AdminModAuthGuard)
  async createMeeting(@Body() body: CreateMeetingReportDto): Promise<Response> {
    return this.reportService.setupMeeting(body)
  }

  @Put('/admin/resolve-skip-report/:id')
  @UseGuards(AdminModAuthGuard)
  async skipReport(@Param('id') id: number): Promise<Response> {
    return this.reportService.skipReport(id)
  }

  @Put('/admin/resolve-band-tourguide/:id')
  @UseGuards(AdminModAuthGuard)
  async banTourguide(@Param('id') id: number): Promise<Response> {
    return this.reportService.handleBanReportTourguide(id)
  }

  @Put('/admin/resolve-warning-tourguide/:id')
  @UseGuards(AdminModAuthGuard)
  async warningTourguide(@Param('id') id: number): Promise<Response> {
    return this.reportService.handleWarnTourguide(id)
  }
}
