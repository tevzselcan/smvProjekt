import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateSubjectDto {
  @ApiProperty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  teachers?: string[];

  @ApiProperty()
  students?: string[];
}
