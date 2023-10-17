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
  UploadedFile,
  UseInterceptors,
  Response,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubmissionsService } from './submissions.service';
import { Submission } from 'entities/submission.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  isFileExtensionSafe,
  removeFile,
  saveSubmissionFile,
} from 'helpers/fileStorage';
import { join } from 'path';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.entity';
import * as fs from 'fs';

@ApiTags('submissions')
@Controller('submissions')
export class SubmissionsController {
  constructor(private submissionsService: SubmissionsService) {}

  @Get(':id')
  //@HasPermission('submissions')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Submission> {
    return this.submissionsService.findById(id, ['assignment', 'user']);
  }

  @Get('assignment/:id')
  //@HasPermission('submissions')
  @HttpCode(HttpStatus.OK)
  async findSubmissionsForAnAssignment(
    @Param('id') id: string,
  ): Promise<Submission[]> {
    return this.submissionsService.findAllSubmissionsForAnAssignment(id);
  }

  @Get('user/:id')
  //@HasPermission('submissions')
  @HttpCode(HttpStatus.OK)
  async findSubmissionsForAnUser(
    @Param('id') id: string,
  ): Promise<Submission[]> {
    return this.submissionsService.findAllAssignmentsForUser(id);
  }

  @Post()
  //@HasPermission('submissions')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createSubmissionDto: CreateSubmissionDto,
  ): Promise<Submission> {
    return this.submissionsService.create(createSubmissionDto);
  }

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('file', saveSubmissionFile))
  @HttpCode(HttpStatus.CREATED)
  async uploadsubmission(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ): Promise<Submission> {
    const filename = file?.filename;

    if (!filename)
      throw new BadRequestException('File must be a png or jpg/jpeg.');

    const imagesFolderPath = join(process.cwd(), 'files/submissions');
    const fullImagePath = join(imagesFolderPath + '/' + file.filename);
    if (await isFileExtensionSafe(fullImagePath)) {
      await this.submissionsService.updateSubmissionFile(id, filename);
      return await this.submissionsService.findById(id);
    }
    removeFile(fullImagePath);
    throw new BadRequestException('File content does not match extension.');
  }

  @Get('file/:id')
  @HttpCode(HttpStatus.CREATED)
  async getFile(@Param('id') id: string, @Response() res) {
    const submission = await this.submissionsService.findById(id);

    if (!submission) {
      throw new NotFoundException('Assignment not found');
    }

    const filePath = join(process.cwd(), 'files/submissions', submission.file);

    // Ensure the file exists
    if (fs.existsSync(filePath)) {
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${submission.file}"`,
      );
      res.sendFile(filePath);
    } else {
      throw new NotFoundException('File not found');
    }
  }

  @Patch(':id')
  //@HasPermission('submissions')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ): Promise<Submission> {
    return this.submissionsService.update(id, updateSubmissionDto);
  }

  @Delete(':id')
  //@HasPermission('submissions')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<Submission> {
    return this.submissionsService.remove(id);
  }
}
