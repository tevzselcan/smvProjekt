import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Subject } from 'entities/subject.entity';
import { User } from 'entities/user.entity';

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
  user?: User;

  @ApiProperty()
  subject?: Subject;
}
