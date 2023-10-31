import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'entities/permission.entity';
import { AbstractService } from 'modules/abstract/abstract.service';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsService extends AbstractService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionsRepository: Repository<Permission>,
  ) {
    super(permissionsRepository);
  }
}
