import { Request } from 'express'
import { User } from 'entities/user.entity'

export interface TokenPayload {
  name: string
  sub: string
  type: JwtType
}

export interface RequestWithUser extends Request {
  user: User
}

export enum JwtType {
  ACCESS_TOKEN = 'ACCES_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
}

export enum CookieType {
  ACCESS_TOKEN = 'ACCES_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
}
