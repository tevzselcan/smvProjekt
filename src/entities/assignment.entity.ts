import { Entity, Column, ManyToOne } from 'typeorm';
import { Subject } from './subject.entity';
import { Base } from './base.entity';

@Entity()
export class Assignment extends Base {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  due_date: Date;

  @ManyToOne(() => Subject, (subject) => subject.assignments)
  subject: Subject;
}
