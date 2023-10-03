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
import { PaginatedResult } from 'interfaces/paginated-result.interface';
import { ApiTags } from '@nestjs/swagger';
import { SubjectsService } from './subjects.service';
import { HasPermission } from 'decorators/has-permission.decorator';
import { CreateUpdateSubjectDto } from './dto/create-update-subject.dto';
import { Subject } from 'entities/subject.entity';

@ApiTags('subjects')
@Controller('subjects')
export class SubjectsController {
  constructor(private subjectsService: SubjectsService) {}
  @Get()
  //@HasPermission('subjects')
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Subject[]> {
    return this.subjectsService.findAll(['teachers', 'students']);
  }

  @Get('/paginated')
  //@HasPermission('subjects')
  @HttpCode(HttpStatus.OK)
  async paginated(@Query('page') page: number): Promise<PaginatedResult> {
    return this.subjectsService.paginate(page, ['teachers', 'students']);
  }

  @Get(':id')
  //@HasPermission('subjects')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Subject> {
    return this.subjectsService.findById(id, ['teachers', 'students']);
  }

  @Get('student/:id')
  //@HasPermission('subjects')
  @HttpCode(HttpStatus.OK)
  async findStudentSubjects(@Param('id') id: string): Promise<Subject[]> {
    return this.subjectsService.findAllSubjectsForStudent(id);
  }

  @Get('teacher/:id')
  //@HasPermission('subjects')
  @HttpCode(HttpStatus.OK)
  async findTeacherSubjects(@Param('id') id: string): Promise<Subject[]> {
    return this.subjectsService.findAllSubjectsForTeacher(id);
  }

  @Post()
  //@HasPermission('subjects')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createSubjecteDto: CreateUpdateSubjectDto,
    @Body('teachers') teachersIds: string[],
    @Body('students') studentsIds: string[],
  ): Promise<Subject> {
    return this.subjectsService.create(
      createSubjecteDto,
      teachersIds.map((id) => ({
        id,
      })),
      studentsIds.map((id) => ({
        id,
      })),
    );
  }

  @Patch(':id')
  //@HasPermission('subjects')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateSubjectDto: CreateUpdateSubjectDto,
    @Body('teachers') teachersIds: string[],
    @Body('students') studentsIds: string[],
  ): Promise<Subject> {
    return this.subjectsService.update(
      id,
      updateSubjectDto,
      teachersIds.map((id) => ({
        id,
      })),
      studentsIds.map((id) => ({
        id,
      })),
    );
  }

  @Delete(':id')
  //@HasPermission('subjects')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<Subject> {
    return this.subjectsService.remove(id);
  }
}
