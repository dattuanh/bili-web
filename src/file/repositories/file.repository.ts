import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base.repositories';
import { I18nPath } from '../../i18n/i18n.generated';
import { File } from '../entities/file.entity';

@Injectable()
export class FileRepository extends BaseRepository<File> {
  entityNameI18nKey: I18nPath;
  constructor(dataSource: DataSource) {
    super(File, dataSource);
    this.entityNameI18nKey = 'common.word.file';
  }
}
