import { Module } from '@nestjs/common';
import { MeService } from './me.service';
import { MeController } from './me.controller';
import { UsersModule } from 'modules/users/users.module';
import { AssignmentsModule } from 'modules/assignments/assignments.module';
import { SubjectsModule } from 'modules/subjects/subjects.module';
import { SubmissionsModule } from 'modules/submissions/submissions.module';

@Module({
  controllers: [MeController],
  providers: [MeService],
  exports: [MeService],
  imports: [UsersModule, AssignmentsModule, SubjectsModule, SubmissionsModule],
})
export class MeModule {}
