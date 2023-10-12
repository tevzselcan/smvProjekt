import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Subject } from './subject.entity';
import { Base } from './base.entity';
import { Submission } from './submission.entity';
import { User } from './user.entity';

@Entity()
export class Assignment extends Base {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  file: string;

  @Column()
  due_date: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Subject, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject | null;

  @OneToMany(() => Submission, (submission) => submission.assignment)
  submissions: Submission[];
}
