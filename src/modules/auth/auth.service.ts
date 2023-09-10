import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { User } from 'entities/user.entity'
import { UserData } from 'interfaces/user.interface'
import Logging from 'library/Logging'
import { UsersService } from 'modules/users/users.service'
import { compareHash, hash } from 'utils/bcrypt'
import { RegisterUserDto } from './dto/register-user.dto'
import { Request, Response } from 'express'
import { CookieType, JwtType, TokenPayload } from 'interfaces/auth.interface'
import { PostgresErrorCode } from 'helpers/postgresErrorCode.enum'

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findBy({ email: email })
    if (!user) {
      Logging.warn('Invalid credentials could not find user')
      throw new BadRequestException('Invalid credentials could not find user')
    }
    if (!(await compareHash(password, user.password))) {
      Logging.warn('Invalid credentials password does not match')
      throw new BadRequestException('Invalid credentials password does not match')
    }

    Logging.info('User is valid')
    return user
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const hashedPasssword: string = await hash(registerUserDto.password)
    const user = await this.userService.create({
      role_id: null,
      ...registerUserDto,
      password: hashedPasssword,
    })
    return user
  }

  async login(userFromRequest: User, res: Response): Promise<void> {
    const { password, ...user } = await this.userService.findById(userFromRequest.id, ['role'])
    const accessToken = await this.generateToken(user.id, user.email, JwtType.ACCESS_TOKEN)
    const accessTokenCookie = await this.generateCookie(accessToken, CookieType.ACCESS_TOKEN)
    const refreshToken = await this.generateToken(user.id, user.email, JwtType.REFRESH_TOKEN)
    const refreshTokenCookie = await this.generateCookie(refreshToken, CookieType.REFRESH_TOKEN)
    try {
      await this.updateRtHash(user.id, refreshToken)
      res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]).json({ ...user })
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('Something went wrong while setting cookies into response header. 1')
    }
  }

  async signout(userId: string, res: Response): Promise<void> {
    const user = await this.userService.findById(userId)
    await this.userService.update(user.id, { refresh_token: null })
    try {
      res.setHeader('Set-Cookie', this.getCookiesForSignOut()).sendStatus(200)
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('Something went wrong while setting cookies into response header 2')
    }
  }

  async refreshTokens(req: Request): Promise<User> {
    const user = await this.userService.findBy({ refresh_token: req.cookies.refresh_token }, ['role'])
    if (!user) {
      throw new ForbiddenException('Invalid credentials')
    }
    try {
      await this.jwtService.verifyAsync(user.refresh_token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      })
    } catch (error) {
      Logging.error(error)
      throw new UnauthorizedException('Something went wrong while refreshing tokens')
    }

    const token = await this.generateToken(user.id, user.email, JwtType.ACCESS_TOKEN)
    const cookie = await this.generateCookie(token, CookieType.ACCESS_TOKEN)

    try {
      req.res.setHeader('Set-Cookie', cookie)
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('Something went wrong while setting cookies into response header 3')
    }
    return user
  }

  async updateRtHash(userId: string, rt: string): Promise<void> {
    try {
      await this.userService.update(userId, { refresh_token: rt })
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('Something went wrong while updating user refresh token')
    }
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string): Promise<UserData> {
    const user = await this.userService.findById(userId)
    const isRefreshTokenMatching = await compareHash(refreshToken, user.refreshToken)
    if (isRefreshTokenMatching) {
      return {
        id: user.id,
        email: user.email,
      }
    }
  }

  async generateToken(userId: string, email: string, type: JwtType): Promise<string> {
    try {
      const payload: TokenPayload = { sub: userId, name: email, type }
      let token: string
      switch (type) {
        case JwtType.ACCESS_TOKEN:
          token = await this.jwtService.signAsync(payload)
          break
        case JwtType.REFRESH_TOKEN:
          token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: `${this.configService.get('JWT_REFRESH_SECRET_EXPIRES')}s`,
          })
          break
        default:
          throw new BadRequestException('Access denied.')
      }
      return token
    } catch (error) {
      Logging.error(error)
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException('User with that email already exists.')
      }
      throw new InternalServerErrorException('Something went wrong while generating a new token.')
    }
  }

  async generateCookie(token: string, type: CookieType): Promise<string> {
    try {
      let cookie: string
      switch (type) {
        case CookieType.ACCESS_TOKEN:
          cookie = `access_token=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
            'JWT_SECRET_EXPIRES',
          )}; SameSite=strict`
          break
        case CookieType.REFRESH_TOKEN:
          cookie = `refresh_token=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
            'JWT_REFRESH_SECRET_EXPIRES',
          )}; SameSite=strict`
          break
        default:
          throw new BadRequestException('Access denied.')
      }
      return cookie
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('Something went wrong while generating a new cookie.')
    }
  }

  getCookiesForSignOut(): string[] {
    return [`access_token=; HttpOnly; Path=/; Max-Age=0`, `refresh_token=; HttpOnly; Path=/; Max-Age=0`]
  }

  async getUserId(request: Request): Promise<string> {
    const user = request.user as User
    return user.id
  }
}
