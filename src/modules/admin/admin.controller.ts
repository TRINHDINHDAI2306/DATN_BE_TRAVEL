import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Response } from 'src/shares/response/response.interface'

import { AdminAuthGuard } from '../auth/guards/admin-auth.guard'
import { AdminModAuthGuard } from '../auth/guards/admin-mod-auth.guard'

import { AdminService } from './admin.service'
import { ActiveAdminDto } from './dto/active-admin.dto'
import { AdminUpdateMod } from './dto/change-mod-status.dto'
import { CreateAdminDto } from './dto/create-admin.dto'
import { GetListAdminDto } from './dto/get-list-admin.dto'

@Controller('admin')
@ApiTags('Admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/')
  @UseGuards(AdminAuthGuard)
  async createAccount(@Body() body: CreateAdminDto): Promise<Response> {
    return this.adminService.createAccount(body)
  }

  @Get('/')
  @UseGuards(AdminModAuthGuard)
  async getAdmins(@Query() options: GetListAdminDto): Promise<Response> {
    return this.adminService.getListAdmin(options)
  }

  @Get('/:id')
  @UseGuards(AdminAuthGuard)
  async deleteAdmin(@Param('id') id: number): Promise<Response> {
    return this.adminService.deleteModAccount(id)
  }

  @Put('/')
  @UseGuards(AdminAuthGuard)
  async updateMod(@Body() body: AdminUpdateMod): Promise<Response> {
    return this.adminService.updateMod(body)
  }

  @Post('/active-admin')
  async activeAdmin(@Body() body: ActiveAdminDto): Promise<Response> {
    return this.adminService.activeAccount(body)
  }
}
