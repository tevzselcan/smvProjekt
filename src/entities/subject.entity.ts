import { Column, Entity, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Subject extends Base {
  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => User, { cascade: true })
  @JoinTable({
    name: 'subject_teacher',
    joinColumn: { name: 'subject_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  teachers: User[];

  @ManyToMany(() => User, { cascade: true })
  @JoinTable({
    name: 'subject_student',
    joinColumn: { name: 'subject_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  students: User[];
}
