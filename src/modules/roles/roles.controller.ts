import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Role } from 'entities/role.entity';
import { PaginatedResult } from 'interfaces/paginated-result.interface';

import { CreateUpdateRoleDto } from './dto/create-update-role.dto';
import { RolesService } from './roles.service';
import { HasPermission } from 'decorators/has-permission.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}
  @Get()
  @HasPermission('roles')
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Role[]> {
    return this.rolesService.findAll(['permissions']);
  }

  @Get('/paginated')
  @HasPermission('roles')
  @HttpCode(HttpStatus.OK)
  async paginated(@Query('page') page: number): Promise<PaginatedResult> {
    return this.rolesService.paginate(page, ['permissions']);
  }

  @Get(':id')
  @HasPermission('roles')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Role> {
    return this.rolesService.findById(id, ['permissions']);
  }

  @Post()
  @HasPermission('roles')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createRoleDto: CreateUpdateRoleDto,
    @Body('permissions') permissionsIds: string[],
  ): Promise<Role> {
    return this.rolesService.create(
      createRoleDto,
      permissionsIds.map((id) => ({
        id,
      })),
    );
  }

  @Patch(':id')
  @HasPermission('roles')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: CreateUpdateRoleDto,
    @Body('permissions') permissionsIds: string[],
  ): Promise<Role> {
    return this.rolesService.update(
      id,
      updateRoleDto,
      permissionsIds.map((id) => ({
        id,
      })),
    );
  }

  @Delete(':id')
  @HasPermission('roles')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<Role> {
    return this.rolesService.remove(id);
  }
}
