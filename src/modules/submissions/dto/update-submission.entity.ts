import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Assignment } from 'entities/assignment.entity';
import { User } from 'entities/user.entity';

export class UpdateSubmissionDto {
  @ApiProperty()
  assignment?: Assignment;

  @ApiProperty()
  user?: User;

  @ApiProperty()
  file?: string;

  @ApiProperty()
  grade?: string;
}
