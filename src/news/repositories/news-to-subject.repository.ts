import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repositories';
import { I18nPath } from '../../i18n/i18n.generated';
import { NewsToSubject } from '../entities/news-to-subject.entity';

@Injectable()
export class NewsToSubjectRepository extends BaseRepository<NewsToSubject> {
  entityNameI18nKey: I18nPath;
  constructor(dataSource: DataSource) {
    super(NewsToSubject, dataSource);
    this.entityNameI18nKey = 'common.word.newsToSubject';
  }
}
