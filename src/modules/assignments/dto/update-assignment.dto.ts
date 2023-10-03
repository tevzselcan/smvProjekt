import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Subject } from 'entities/subject.entity';

export class UpdateAssignmentDto {
  @ApiProperty()
  title?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  file?: string;

  @ApiProperty()
  due_date?: string;

  @ApiProperty()
  subject?: Subject;
}
