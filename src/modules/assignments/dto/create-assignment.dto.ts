import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Subject } from 'entities/subject.entity';

export class CreateAssignmentDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  due_date: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  subject: Subject;
}
