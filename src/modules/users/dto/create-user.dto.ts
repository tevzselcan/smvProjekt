import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true })
  first_name?: string;

  @ApiProperty({ required: true })
  last_name?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  role_id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/, {
    message:
      'Passowrd must have atleast obe number, lower or uppercase latter and has to be longer than 5 charcters',
  })
  password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  confirm_password: string;
}
