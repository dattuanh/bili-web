import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmCustomModule } from 'utility/dist';
import { AuthModule } from '../auth/auth.module';
import { UtilsModule } from '../utils/utils.module';
import { FileAdminController } from './controllers/admin/file.admin.controller';
import { FileRepository } from './repositories/file.repository';
import { FileAdminService } from './services/admin/file.admin.service';
import { FileSubscriber } from './subscribers/file.subscriber';

@Module({
  imports: [
    UtilsModule,
    forwardRef(() => AuthModule),
    TypeOrmCustomModule.forFeature([FileRepository]),
  ],
  controllers: [
    FileAdminController,
  ],
  providers: [
    FileAdminService,
    FileSubscriber,
  ],
  // exports: [FileMerchantService],
})
export class FileModule {}
