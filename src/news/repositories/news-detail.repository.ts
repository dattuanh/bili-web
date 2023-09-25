import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repositories';
import { I18nPath } from '../../i18n/i18n.generated';
import { NewsDetail } from '../entities/news-detail.entity';

@Injectable()
export class NewsDetailRepository extends BaseRepository<NewsDetail> {
  entityNameI18nKey: I18nPath;
  constructor(dataSource: DataSource) {
    super(NewsDetail, dataSource);
    this.entityNameI18nKey = 'common.word.newsDetail';
  }
}
