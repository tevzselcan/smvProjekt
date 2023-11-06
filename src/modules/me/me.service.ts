import { Injectable } from '@nestjs/common';
import { Assignment } from 'entities/assignment.entity';
import { Subject } from 'entities/subject.entity';
import { Submission } from 'entities/submission.entity';
import { User } from 'entities/user.entity';
import { AssignmentsService } from 'modules/assignments/assignments.service';
import { SubjectsService } from 'modules/subjects/subjects.service';
import { SubmissionsService } from 'modules/submissions/submissions.service';
import { UpdateUserDto } from 'modules/users/dto/update-user.dto';
import { UsersService } from 'modules/users/users.service';

@Injectable()
export class MeService {
  constructor(
    private userService: UsersService,
    private assignmentService: AssignmentsService,
    private subjectService: SubjectsService,
    private submissionService: SubmissionsService,
  ) {}

  async updateUser(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userService.update(user.id, updateUserDto);
  }

  async getUserSubjects(user: User): Promise<Subject[]> {
    return await this.subjectService.findForAll(user.id);
  }

  async getUsersAssignments(user: User): Promise<Assignment[]> {
    return await this.assignmentService.findAllAssignmentsForUser(user.id);
  }

  async getUsersSubmissions(user: User): Promise<Submission[]> {
    return await this.submissionService.findAllSubmissionsForUser(user.id);
  }

  async getLoggedUserInfo(user: User): Promise<User> {
    return await this.userService.findById(user.id, ['role']);
  }
}
