import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
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
  saveFileToStorage,
} from 'helpers/fileStorage';
import { join } from 'path';

@ApiTags('assignments')
@Controller('assignments')
export class AssignmentsController {
  constructor(private assignmentsService: AssignmentsService) {}
  @Get()
  //@HasPermission('assignments')
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Assignment[]> {
    return this.assignmentsService.findAll(['subject']);
  }

  @Get('/paginated')
  //@HasPermission('assignments')
  @HttpCode(HttpStatus.OK)
  async paginated(@Query('page') page: number): Promise<PaginatedResult> {
    return this.assignmentsService.paginate(page, ['subject']);
  }

  @Get(':id')
  //@HasPermission('assignments')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Assignment> {
    return this.assignmentsService.findById(id, ['subject']);
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
  @UseInterceptors(FileInterceptor('file', saveFileToStorage))
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ): Promise<Assignment> {
    const filename = file?.filename;

    if (!filename)
      throw new BadRequestException('File must be a png or jpg/jpeg.');

    const imagesFolderPath = join(process.cwd(), 'files');
    const fullImagePath = join(imagesFolderPath + '/' + file.filename);
    if (await isFileExtensionSafe(fullImagePath)) {
      return this.assignmentsService.updateAssignmentFile(id, filename);
    }
    removeFile(fullImagePath);
    throw new BadRequestException('File content does not match extension.');
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
