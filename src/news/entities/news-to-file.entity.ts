import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PartialIndexWithSoftDelete } from '../../common/decorators/typeorm.decorator';
import { BaseEntityWithoutUpdateAndVersion } from '../../common/entities/base.entity';
import { File } from '../../file/entities/file.entity';
import { News } from './news.entity';

@Entity({ name: 'news_to_file' })
@PartialIndexWithSoftDelete(['newsId', 'thumbnailId'], {
  unique: true,
})
export class NewsToFile extends BaseEntityWithoutUpdateAndVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'news_id' })
  newsId: number;

  @OneToOne(() => News, (item) => item.newsToFile, { persistence: false })
  @JoinColumn({ name: 'news_id' })
  news: News;

  @Column({ name: 'thumbnail_id' })
  thumbnailId: number;

  @OneToOne(() => File, (item) => item.newsToFile, { persistence: false })
  @JoinColumn({ name: 'thumbnail_id' })
  thumbnail: File;
}
