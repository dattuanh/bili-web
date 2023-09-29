import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DBTypeName } from '../../common/constants/db-type-name.constant';
import { PartialIndexWithSoftDelete } from '../../common/decorators/typeorm.decorator';
import { BaseEntity } from '../../common/entities/base.entity';
import { Language } from '../../common/enums/lang.enum';
import { Subject } from './subject.entity';

@Entity({ name: 'subject_detail' })
@PartialIndexWithSoftDelete(['lang', 'subjectId'], {
  unique: true,
})
export class SubjectDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: Language, enumName: DBTypeName.language })
  lang: Language;

  @Column({ nullable: true, unique: true })
  slug: string;

  @Column({ name: 'subject_id' })
  subjectId: number;

  @ManyToOne(() => Subject, (subject) => subject.subjectDetails, {
    persistence: false,
  })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;
}
