import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PartialIndexWithSoftDelete } from '../../common/decorators/typeorm.decorator';
import { BaseEntityWithoutUpdateAndVersion } from '../../common/entities/base.entity';
import { Subject } from '../../subject/entities/subject.entity';
import { News } from './news.entity';

@Entity({ name: 'news_to_subject' })
@PartialIndexWithSoftDelete(['newsId', 'subjectId'], {
  unique: true,
})
export class NewsToSubject extends BaseEntityWithoutUpdateAndVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'news_id' })
  newsId: number;

  @ManyToOne(() => News, (item) => item.newsToSubjects, { persistence: false })
  @JoinColumn({ name: 'news_id' })
  news: News;

  @Column({ name: 'subject_id' })
  subjectId: number;

  @ManyToOne(() => Subject, (item) => item.newsToSubjects, {
    persistence: false,
  })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;
}
