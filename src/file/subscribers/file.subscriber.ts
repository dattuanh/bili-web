import { ConfigService } from '@nestjs/config';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  LoadEvent,
} from 'typeorm';
import { AppConfig } from '../../common/config/app.config';
import { File } from '../entities/file.entity';

@EventSubscriber()
export class FileSubscriber implements EntitySubscriberInterface<File> {
  constructor(
    dataSource: DataSource,
    private configService: ConfigService<AppConfig>,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo(): string | Function {
    return File;
  }

  afterLoad(entity: File, event?: LoadEvent<File>): void | Promise<any> {
    const file = event.entity;

    if (file.url) return;

    event.entity.url = this.createUrl(entity.key);
  }

  afterInsert(event: InsertEvent<File>): void | Promise<any> {
    const file = event.entity;

    if (file.url) return;

    event.entity.url = this.createUrl(file.key);
  }

  createUrl(key: string): string {
    const bucket = this.configService.get('aws.s3.bucketName', {
      infer: true,
    });
    const region = this.configService.get('aws.region', { infer: true });
    const baseUrl = `https://s3.${region}.amazonaws.com/${bucket}`;
    return `${baseUrl}/${key}`;
  }
}
