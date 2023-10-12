import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Assignment } from 'entities/assignment.entity';
import { User } from 'entities/user.entity';

export class CreateSubmissionDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  assignment?: Assignment;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  user?: User;
}
