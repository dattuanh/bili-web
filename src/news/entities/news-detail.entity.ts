import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DBTypeName } from '../../common/constants/db-type-name.constant';
import { BaseEntity } from '../../common/entities/base.entity';
import { Language } from '../../common/enums/lang.enum';
import { News } from './news.entity';

@Entity({ name: 'news_detail' })
export class NewsDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  content: string;

  @Column({ type: 'enum', enum: Language, enumName: DBTypeName.language })
  lang: Language;

  @Column()
  description: string;

  @Column({ nullable: true, unique: true })
  slug: string;

  @Column({ name: 'news_id' })
  newsId: number;

  @ManyToOne(() => News, (news) => news.newsDetails, { persistence: false })
  @JoinColumn()
  news: News;
}
