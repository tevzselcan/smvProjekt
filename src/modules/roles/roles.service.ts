import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'entities/role.entity';
import { AbstractService } from 'modules/abstract/abstract.service';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService extends AbstractService {
  constructor(
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
  ) {
    super(rolesRepository);
  }
}
