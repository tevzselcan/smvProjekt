import { GetCurrentUser } from 'decorators/get-current-user.decorator';
import { MeService } from './me.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { User } from 'entities/user.entity';
import { UpdateUserDto } from 'modules/users/dto/update-user.dto';
import { Subject } from 'entities/subject.entity';
import { Assignment } from 'entities/assignment.entity';
import { Submission } from 'entities/submission.entity';
import { UserData } from 'interfaces/user.interface';

@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@GetCurrentUser() user: User): Promise<User> {
    return await this.meService.getLoggedUserInfo(user);
  }

  @Get('subjects/teacher')
  @HttpCode(HttpStatus.OK)
  async getSubjectsForUserTeacher(
    @GetCurrentUser() user: User,
  ): Promise<Subject[]> {
    return this.meService.getUserTeacherSubjects(user);
  }

  @Get('subjects/student')
  @HttpCode(HttpStatus.OK)
  async getSubjectsForUserStudent(
    @GetCurrentUser() user: User,
  ): Promise<Subject[]> {
    return this.meService.getUserStudentSubjects(user);
  }

  @Get('assignments')
  @HttpCode(HttpStatus.OK)
  async getAssignmentsForUser(
    @GetCurrentUser() user: User,
  ): Promise<Assignment[]> {
    return this.meService.getUsersAssignments(user);
  }

  @Get('submissions')
  @HttpCode(HttpStatus.OK)
  async getSubmissionsForUser(
    @GetCurrentUser() user: User,
  ): Promise<Submission[]> {
    return this.meService.getUsersSubmissions(user);
  }

  @Patch('update')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @GetCurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.meService.updateUser(user, updateUserDto);
  }
}
