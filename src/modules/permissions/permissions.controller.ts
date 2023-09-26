import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { Permission } from 'entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { HasPermission } from 'decorators/has-permission.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  //@HasPermission('permissions')
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Permission[]> {
    return this.permissionsService.findAll();
  }

  @Post()
  //@HasPermission('permissions')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    return this.permissionsService.create(createPermissionDto);
  }
}
