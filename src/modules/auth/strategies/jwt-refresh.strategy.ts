import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from '../auth.service'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { TokenPayload } from 'interfaces/auth.interface'
import { UserData } from 'interfaces/user.interface'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private authService: AuthService, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refresh_token
        },
      ]),
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      passRequestToCallback: true,
    })
  }

  async validate(req: Request, payload: TokenPayload): Promise<UserData> {
    const refreshToken = req.cookies?.refresh_token
    return this.authService.getUserIfRefreshTokenMatches(refreshToken, payload.sub)
  }
}
