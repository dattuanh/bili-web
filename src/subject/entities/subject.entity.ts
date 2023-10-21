import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { File } from '../../file/entities/file.entity';
import { NewsToSubject } from '../../news/entities/news-to-subject.entity';
import { SubjectDetail } from './subject-detail.entity';

@Entity({ name: 'subject' })
export class Subject extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => SubjectDetail, (sd) => sd.subject, { persistence: false })
  @JoinColumn()
  subjectDetails: SubjectDetail[];

  @Column({ nullable: true })
  priority: number;

  // join owner
  @Column({ name: 'owner_id' })
  ownerId: number;

  @ManyToOne(() => User, (user) => user.subjects, { persistence: false })
  @JoinColumn({ name: 'owner_id' })
  owner: User;
  // End join user

  @OneToMany(() => NewsToSubject, (nb) => nb.subject, { persistence: false })
  newsToSubjects: NewsToSubject[];

  // join file
  @Column({ nullable: true })
  thumbnailId: number;

  @OneToOne(() => File, (file) => file.subject, { persistence: false })
  @JoinColumn()
  thumbnail: File;
  //end join file
}
