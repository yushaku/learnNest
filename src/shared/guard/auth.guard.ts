import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const authorization = req.headers?.authorization
    let accessToken = authorization?.replace('Bearer ', '')

    if (!accessToken) {
      accessToken = req.cookies?.access_token
    }

    try {
      req.user = this.jwtService.verify(accessToken)
      return true
    } catch (err) {
      return false
    }
  }
}
