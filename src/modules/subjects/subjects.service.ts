import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from 'entities/subject.entity';
import { AbstractService } from 'modules/abstract/abstract.service';
import { Repository } from 'typeorm';
import { CreateUpdateSubjectDto } from './dto/create-update-subject.dto';
import Logging from 'library/Logging';
import { User } from 'entities/user.entity';

@Injectable()
export class SubjectsService extends AbstractService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>,
  ) {
    super(subjectsRepository);
  }

  async create(
    createSubjectDto: CreateUpdateSubjectDto,
    teacherIds: { id: string }[],
    studentIds: { id: string }[],
  ): Promise<Subject> {
    try {
      const subject = this.subjectsRepository.create({
        ...createSubjectDto,
        teachers: teacherIds,
        students: studentIds,
      });
      return await this.subjectsRepository.save(subject);
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException(
        'Something went wrong while creating a new subject.',
      );
    }
  }

  async update(
    subjecId: string,
    updateSubjectDto: CreateUpdateSubjectDto,
    teacherIds: { id: string }[],
    studentIds: { id: string }[],
  ): Promise<Subject> {
    const subject = (await this.findById(subjecId)) as Subject;
    try {
      subject.name = updateSubjectDto.name;
      subject.description = updateSubjectDto.description;
      subject.teachers = teacherIds as User[];
      subject.students = studentIds as User[];

      return this.subjectsRepository.save(subject);
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while updating a subject.',
      );
    }
  }
}
