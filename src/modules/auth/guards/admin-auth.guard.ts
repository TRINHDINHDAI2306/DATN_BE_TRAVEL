import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { AdminService } from 'src/modules/admin/admin.service'
import { httpErrors } from 'src/shares/exceptions'
import { Connection } from 'typeorm'

@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly connection: Connection,
    private readonly adminService: AdminService,
    private jtwSv: JwtService,
  ) {
    super()
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const { headers } = request
    if (!headers?.authorization) {
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
    }
    const token = headers.authorization.split(' ')
    if (token.length < 2 || token[0] != 'Bearer') {
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
    }
    try {
      const adminJwt = await this.jtwSv.verify(token[1])

      const admin = await this.adminService.getAdminByIdAndUsername(adminJwt.id, adminJwt.username)
      if (!admin) {
        throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
      }
      return adminJwt
    } catch (error) {
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
    }
  }
}
