import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { FastifyRequest } from 'fastify'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: FastifyRequest) => {
          const authorization = request.headers.authorization || ''
          let access_token = authorization.replace('Bearer ', '')

          if (!access_token) {
            access_token = request.cookies?.access_token
          }
          return access_token
        },
      ]),
      secretOrKey: process.env.JWT_SECRET,
    })
  }
}
