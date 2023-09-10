import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator'

export class LoginUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ required: true })
  @IsNotEmpty()
  password: string
}