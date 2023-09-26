import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Subject } from './subject.entity';
import { Base } from './base.entity';

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

  @ManyToOne(() => Subject, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject | null;
}
