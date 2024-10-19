import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'

import { AdminModule } from '../admin/admin.module'
import { MailModule } from '../mail/mail.module'
import { TourGuideModule } from '../tourguide/tour-guide.module'
import { UserModule } from '../user/user.module'

import { TransactionController } from './transaction.controller'
import { TransactionService } from './transaction.service'

@Module({
  imports: [
    UserModule,
    TourGuideModule,
    AdminModule,
    JwtModule.registerAsync({
      imports: [ConfigModule, MailModule],
      useFactory: (configService: ConfigService) =>
        ({
          secret: configService.get('SECRET_JWT'),
          signOptions: {
            expiresIn: '1d',
          },
        }) as JwtModuleOptions,
      inject: [ConfigService],
    }),
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [],
})
export class TransactionModule {}
