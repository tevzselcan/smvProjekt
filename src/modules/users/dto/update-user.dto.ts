import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, Matches, ValidateIf } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  first_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  last_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  refresh_token?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  role_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  avatar?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => typeof o.password === 'string' && o.password.lenght > 0)
  @IsOptional()
  @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/, {
    message:
      'Passowrd must have atleast obe number, lower or uppercase latter and has to be longer than 5 charcters',
  })
  password?: string;

  @ApiProperty({ required: false })
  @ValidateIf(
    (o) =>
      typeof o.confirm_password === 'string' && o.confirm_password.lenght > 0,
  )
  @IsOptional()
  confirm_password?: string;
}
