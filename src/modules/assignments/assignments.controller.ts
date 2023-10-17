import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
  Response,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginatedResult } from 'interfaces/paginated-result.interface';
import { ApiTags } from '@nestjs/swagger';
import { HasPermission } from 'decorators/has-permission.decorator';
import { Assignment } from 'entities/assignment.entity';
import { AssignmentsService } from './assignments.service';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import {
  isFileExtensionSafe,
  removeFile,
  saveAssignmentFile,
} from 'helpers/fileStorage';
import { join } from 'path';
import * as fs from 'fs';

@ApiTags('assignments')
@Controller('assignments')
export class AssignmentsController {
  constructor(private assignmentsService: AssignmentsService) {}
  @Get()
  //@HasPermission('assignments')
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Assignment[]> {
    return this.assignmentsService.findAll(['user', 'subject']);
  }

  @Get(':id')
  //@HasPermission('assignments')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Assignment> {
    return this.assignmentsService.findById(id, ['user', 'subject']);
  }

  @Get('subject/:id')
  //@HasPermission('assignments')
  @HttpCode(HttpStatus.OK)
  async findAssignmentsForSubject(
    @Param('id') id: string,
  ): Promise<Assignment[]> {
    return this.assignmentsService.findAllAssignmentsForClass(id);
  }

  @Post()
  //@HasPermission('assignments')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createAssignmenteDto: CreateAssignmentDto,
  ): Promise<Assignment> {
    return this.assignmentsService.create(createAssignmenteDto);
  }

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('file', saveAssignmentFile))
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ): Promise<Assignment> {
    const filename = file?.filename;

    if (!filename)
      throw new BadRequestException('File must be a png or jpg/jpeg.');

    const imagesFolderPath = join(process.cwd(), 'files/assignments');
    const fullImagePath = join(imagesFolderPath + '/' + file.filename);
    if (await isFileExtensionSafe(fullImagePath)) {
      await this.assignmentsService.updateAssignmentFile(id, filename);
      return await this.assignmentsService.findById(id);
    }
    removeFile(fullImagePath);
    throw new BadRequestException('File content does not match extension.');
  }

  @Get('file/:id')
  @HttpCode(HttpStatus.CREATED)
  async getFile(@Param('id') id: string, @Response() res) {
    const assignment = await this.assignmentsService.findById(id);

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    const filePath = join(process.cwd(), 'files/assignments', assignment.file);

    // Ensure the file exists
    if (fs.existsSync(filePath)) {
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${assignment.file}"`,
      );
      res.sendFile(filePath);
    } else {
      throw new NotFoundException('File not found');
    }
  }

  @Patch(':id')
  //@HasPermission('assignments')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateAssignmentsDto: UpdateAssignmentDto,
  ): Promise<Assignment> {
    return this.assignmentsService.update(id, updateAssignmentsDto);
  }

  @Delete(':id')
  //@HasPermission('assignments')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<Assignment> {
    return this.assignmentsService.remove(id);
  }
}
