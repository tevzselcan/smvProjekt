import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'modules/abstract/abstract.service';
import { Repository } from 'typeorm';
import { Assignment } from 'entities/assignment.entity';
import Logging from 'library/Logging';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Injectable()
export class AssignmentsService extends AbstractService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentsRepository: Repository<Assignment>,
  ) {
    super(assignmentsRepository);
  }

  async create(createAssignmenteDto: CreateAssignmentDto): Promise<Assignment> {
    try {
      const assignment =
        this.assignmentsRepository.create(createAssignmenteDto);
      return this.assignmentsRepository.save(assignment);
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException(
        'Something went wrong while creating a new assignment.',
      );
    }
  }

  async update(
    assignmentId: string,
    updateAssignmentsDto: UpdateAssignmentDto,
  ): Promise<Assignment> {
    const assignment = (await this.findById(assignmentId)) as Assignment;
    try {
      assignment.title = updateAssignmentsDto.title;
      assignment.description = updateAssignmentsDto.description;
      assignment.due_date = updateAssignmentsDto.due_date;
      assignment.subject = updateAssignmentsDto.subject;
      assignment.file = updateAssignmentsDto.file;
      assignment.user = updateAssignmentsDto.user;

      return this.assignmentsRepository.save(assignment);
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while updating an assignment.',
      );
    }
  }

  async updateAssignmentFile(id: string, file: string): Promise<Assignment> {
    const assignment = await this.findById(id);
    return this.update(assignment.id, { file });
  }

  async findAllAssignmentsForClass(subject_id: string): Promise<Assignment[]> {
    return await this.assignmentsRepository.find({
      where: { subject: { id: subject_id } },
      relations: ['subject'],
    });
  }
}
