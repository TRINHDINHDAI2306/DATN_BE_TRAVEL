import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { GenAdminDto } from './dto/gen-admin.dto'
import { GenDataService } from './gen-data.service'

@Controller('gen-data')
@ApiTags('Data')
@ApiBearerAuth()
export class GenDataController {
  constructor(private readonly genDataService: GenDataService) {}

  @Post('/provinces')
  // HDV tạo
  async genProvinces() {
    return this.genDataService.GenProvince()
  }

  @Post('/admin')
  // HDV tạo
  async getAdmin(@Body() body: GenAdminDto) {
    return this.genDataService.genAdminAccount(body)
  }

  @Post('/gen-permission')
  async genPermission() {
    return this.genDataService.genLevelPermission()
  }
}
