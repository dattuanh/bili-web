import { Module } from '@nestjs/common';
import { TypeOrmCustomModule } from 'utility/dist';
import { NewsToSubjectRepository } from '../news/repositories/news-to-subject.repository';
import { NewsRepository } from '../news/repositories/news.repository';
import { SubjectController } from './controller/common/subject.controller';
import { SubjectAdminController } from './controller/admin/subject.admin.controller';
import { SubjectDetailRepository } from './repositories/subject-detail.repository';
import { SubjectRepository } from './repositories/subject.repository';
import { SubjectService } from './services/common/subject.service';
import { SubjectDetailAdminService } from './services/admin/subject-detail.admin.service';
import { SubjectAdminService } from './services/admin/subject.admin.service';
import { AdminRepository } from '../auth/repositories/admin.repository';


@Module({
  imports: [
    TypeOrmCustomModule.forFeature([
      SubjectDetailRepository,
      SubjectRepository,
      AdminRepository,
      NewsRepository,
      NewsToSubjectRepository,
    ]),
  ],
  controllers: [SubjectAdminController, SubjectController],
  providers: [
    SubjectAdminService,
    SubjectDetailAdminService,
    SubjectService,
  ],
  exports: [],
})
export class SubjectModule {}
