import { Module } from '@nestjs/common'
import { TourGuideService } from 'src/modules/tourguide/tour-guide.service'

import { SharedModule } from '../shared/shared.module'

import { ChatGateWay } from './chat.gateway'
import { ChatService } from './chat.service'

@Module({
  imports: [SharedModule],
  controllers: [],
  providers: [ChatGateWay, ChatService, TourGuideService],
  exports: [ChatGateWay],
})
export class ChatModule {}
