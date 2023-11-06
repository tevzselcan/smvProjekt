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
import { UpdateSubjectDto } from './dto/update-subject.dto';

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
    updateSubjectDto: UpdateSubjectDto,
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

  async findAllSubjectsForStudent(studentId: string): Promise<Subject[]> {
    return await this.subjectsRepository.find({
      where: { students: { id: studentId } },
      relations: ['students'],
    });
  }

  async findAllSubjectsForTeacher(teacherId: string): Promise<Subject[]> {
    return await this.subjectsRepository.find({
      where: { teachers: { id: teacherId } },
      relations: ['teachers'],
    });
  }

  async findForAll(userId: string): Promise<Subject[]> {
    return await this.subjectsRepository.find({
      where: { teachers: { id: userId } } || { students: { id: userId } },
    });
  }
}
