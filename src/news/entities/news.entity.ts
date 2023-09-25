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
import { NewsStatus } from '../enums/news.enum';
import { NewsDetail } from './news-detail.entity';
import { NewsToFile } from './news-to-file.entity';
import { NewsToSubject } from './news-to-subject.entity';

@Entity({ name: 'news' })
export class News extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: NewsStatus })
  status: NewsStatus;

  @Column({ name: 'owner_id' })
  ownerId: number;

  @ManyToOne(() => User, (user) => user.news, { persistence: false })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => NewsDetail, (nd) => nd.news, { persistence: false })
  newsDetails: NewsDetail[];

  @OneToOne(() => NewsToFile, (nf) => nf.news, { persistence: false })
  newsToFile: NewsToFile;

  @OneToMany(() => NewsToSubject, (nb) => nb.news, { persistence: false })
  @JoinColumn({ name: 'news_id' })
  newsToSubjects: NewsToSubject[];
}
