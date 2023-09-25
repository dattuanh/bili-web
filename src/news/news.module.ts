import { Module } from '@nestjs/common';
import { TypeOrmCustomModule } from 'utility/dist';
import { NewsRepository } from '../news/repositories/news.repository';
import { SubjectRepository } from '../subject/repositories/subject.repository';
import { NewsController } from './controllers/common/news.controller';
import { NewsAdminController } from './controllers/admin/news.admin.controller';
import { NewsDetailRepository } from './repositories/news-detail.repository';
import { NewsToFileRepository } from './repositories/news-to-file.repository';
import { NewsToSubjectRepository } from './repositories/news-to-subject.repository';
import { NewsService } from './services/common/news.service';
import { NewsDetailAdminService } from './services/admin/news-detail.admin.service';
import { NewsAdminService } from './services/admin/news.admin.service';
import { AdminRepository } from '../auth/repositories/admin.repository';
import { UserRepository } from '../auth/repositories/user.repository';

@Module({
  imports: [
    TypeOrmCustomModule.forFeature([
      NewsDetailRepository,
      NewsRepository,
      AdminRepository,
      UserRepository,
      NewsRepository,
      NewsToFileRepository,
      NewsToSubjectRepository,
      SubjectRepository,
    ]),
  ],
  controllers: [NewsAdminController, NewsController],
  providers: [
    NewsAdminService,
    NewsDetailAdminService,
    NewsService,
  ],
  exports: [],
})
export class NewsModule {}
