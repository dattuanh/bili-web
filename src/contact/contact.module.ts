import { Module } from '@nestjs/common';
import { ContactController } from './controllers/common/contact.controller';
import { ContactService } from './services/common/contact.service';
import { TypeOrmCustomModule } from 'utility/dist';
import { ContactRepository } from './repositories/contact.repository';
import { ContactAdminService } from './services/admin/contact.admin.service';
import { ContactAdminController } from './controllers/admin/contact.admin.controller';

@Module({
  imports: [
    TypeOrmCustomModule.forFeature([
      ContactRepository,
    ]),
  ],
  controllers: [ContactController, ContactAdminController],
  providers: [ContactService, ContactAdminService],
  exports: [],  
})
export class ContactModule {}
