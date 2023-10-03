import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import Logging from 'library/Logging';
import { AbstractService } from 'modules/abstract/abstract.service';
import { Repository } from 'typeorm';
import { compareHash, hash } from 'utils/bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Subject } from 'entities/subject.entity';

@Injectable()
export class UsersService extends AbstractService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findBy({ email: createUserDto.email });
    if (user) {
      throw new BadRequestException('User with that email already exists!');
    }
    try {
      const newUser = this.userRepository.create({
        ...createUserDto,
        role: { id: createUserDto.role_id },
      });
      return this.userRepository.save(newUser);
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException(
        'Something went wrong while creating a new user.',
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = (await this.findById(id)) as User;
    const { email, password, confirm_password, role_id, ...data } =
      updateUserDto;
    if (user.email !== email && email) {
      user.email = email;
    }
    if (password && confirm_password) {
      if (password !== confirm_password) {
        throw new BadRequestException('Passwords do not match.');
      }
      if (await compareHash(password, user.password)) {
        throw new BadRequestException(
          'New password cannot be the same as your old password.',
        );
      }
      user.password = await hash(password);
    }
    if (role_id) {
      user.role = { ...user.role, id: role_id };
    }
    try {
      Object.entries(data).map((entry) => {
        user[entry[0]] = entry[1];
      });
      return this.userRepository.save(user);
    } catch (error) {
      Logging.error(error);
      if (error?.code === '23505') {
        throw new BadRequestException('User with that email already exists.');
      }
      throw new InternalServerErrorException(
        'Something went wrong while updating the user.',
      );
    }
  }
}
