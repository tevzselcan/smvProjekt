import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { Assignment } from './assignment.entity';
import { User } from './user.entity';

@Entity()
export class Submission extends Base {
  @ManyToOne(() => Assignment, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assignment_id' })
  assignment: Assignment;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  file: string;
}
