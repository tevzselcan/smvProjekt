import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'decorators/public.decorator';
import { User } from 'entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUser } from 'interfaces/auth.interface';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { GetCurrentUserId } from 'decorators/get-current-user-id.decorator';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { UserData } from 'interfaces/user.interface';
import { GetCurrentUser } from 'decorators/get-current-user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterUserDto): Promise<User> {
    return this.authService.register(body);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ): Promise<void> {
    return this.authService.login(req.user, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async signout(
    @GetCurrentUserId() userId: string,
    @Res() res: Response,
  ): Promise<void> {
    return this.authService.signout(userId, res);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.ACCEPTED)
  async refreshTokens(@Req() req: Request): Promise<User> {
    return this.authService.refreshTokens(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@GetCurrentUser() user: User): Promise<UserData> {
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      avatar: user.avatar,
      role: user.role?.id ? { id: user.role?.id, name: user.role?.name } : null,
    };
  }
}
