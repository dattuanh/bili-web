import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repositories';
import { I18nPath } from '../../i18n/i18n.generated';
import { News } from '../entities/news.entity';

@Injectable()
export class NewsRepository extends BaseRepository<News> {
  entityNameI18nKey: I18nPath;
  constructor(dataSource: DataSource) {
    super(News, dataSource);
    this.entityNameI18nKey = 'common.word.news';
  }
}
