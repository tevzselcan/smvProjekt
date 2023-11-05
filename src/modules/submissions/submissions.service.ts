import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from 'entities/submission.entity';
import { AbstractService } from 'modules/abstract/abstract.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import Logging from 'library/Logging';
import { UpdateSubmissionDto } from './dto/update-submission.entity';

@Injectable()
export class SubmissionsService extends AbstractService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,
  ) {
    super(submissionRepository);
  }

  async create(createSubmissionDto: CreateSubmissionDto): Promise<Submission> {
    try {
      const submission = this.submissionRepository.create(createSubmissionDto);
      return this.submissionRepository.save(submission);
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException(
        'Something went wrong while creating a new assignment.',
      );
    }
  }

  async update(
    submissionId: string,
    updateSubmissionsDto: UpdateSubmissionDto,
  ): Promise<Submission> {
    const submission = (await this.findById(submissionId)) as Submission;
    try {
      submission.assignment = updateSubmissionsDto.assignment;
      submission.user = updateSubmissionsDto.user;
      submission.file = updateSubmissionsDto.file;

      return this.submissionRepository.save(submission);
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while updating an assignment.',
      );
    }
  }

  async updateSubmissionFile(id: string, file: string): Promise<Submission> {
    const submission = await this.findById(id);
    return this.update(submission.id, { file });
  }

  async findAllSubmissionsForAnAssignment(
    assignment_id,
  ): Promise<Submission[]> {
    return await this.submissionRepository.find({
      where: { assignment: { id: assignment_id } },
      relations: ['assignment'],
    });
  }

  async findAllSubmissionsForUser(user_id: string): Promise<Submission[]> {
    return await this.submissionRepository.find({
      where: { user: { id: user_id } },
      relations: ['user', 'assignment'],
    });
  }
}
