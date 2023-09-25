import { OnQueueActive, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { serializeError } from 'serialize-error';
import { UserType } from '../../auth/enums/user.enum';
// import { CustomerMerchantService } from '../../auth/services/merchant/customer.merchant.service';
// import { RequestImport } from '../../import/entities/request-import.entity';
// import {
//   RequestImportStatus,
//   RequestImportType,
// } from '../../import/enums/request-import.enum';
// import { RequestImportRepository } from '../../import/repositories/request-import.repository';
// import { ProvinceAdminService } from '../../province/services/admin/province.admin.service';
// import { ExternalReferrerMerchantService } from '../../referral/services/merchant/external-referrer.merchant.service';
// import { StoreMerchantService } from '../../store/services/merchant/store.merchant.service';
import { ImportJobDataDto } from '../dto/import-job-data.dto';
import { QueueName } from '../enums/worker.enum';

@Processor(QueueName.IMPORT)
export class ImportProcessor {
  private logger = new Logger(ImportProcessor.name);
  constructor(
    // private requestImportRepo: RequestImportRepository,

    // private referrerMerchantService: ExternalReferrerMerchantService,
    // private storeMerchantService: StoreMerchantService,
    // private provinceAdminService: ProvinceAdminService,
    // private customerMerchantService: CustomerMerchantService,
  ) {}

  // @OnQueueFailed()
  // async onFailed(job: Job<ImportJobDataDto>) {
  //   const { requestImportId } = job.data;
  //   await this.requestImportRepo.update(requestImportId, {
  //     status: RequestImportStatus.FAILED,
  //   });
  // }

  // @OnQueueActive()
  // async onActive(job: Job<ImportJobDataDto>) {
  //   const { requestImportId } = job.data;
  //   await this.requestImportRepo.update(requestImportId, {
  //     status: RequestImportStatus.PROCESSING,
  //   });
  // }

  // @Process({ concurrency: 3 })
  // async process(job: Job<ImportJobDataDto>) {
  //   const { requestImportId } = job.data;

  //   const requestImport = await this.requestImportRepo.findOne({
  //     where: { id: requestImportId },
  //     relations: { owner: { merchant: true }, file: true },
  //   });

  //   if (!requestImport) {
  //     this.logger.error(
  //       `Request import not found. JobId=${job.id}, requestImportId=${requestImportId}`,
  //     );
  //     return;
  //   }

  //   try {
  //     switch (requestImport.type) {
  //       case RequestImportType.LIST_EXTERNAL_REFERRER:
  //         await this.handleImportListExternalReferrer(requestImport);
  //         break;

  //       case RequestImportType.LIST_STORE:
  //         await this.handleImportListStore(requestImport);
  //         break;
  //       case RequestImportType.LIST_PROVINCE:
  //         await this.handleImportListProvince(requestImport);
  //         break;

  //       case RequestImportType.LIST_CUSTOMER:
  //         await this.handleImportListCustomer(requestImport);
  //         break;
  //       default:
  //         throw new Error(
  //           `Request import resource is invalid, requestImportId=${requestImportId}`,
  //         );
  //     }

  //     await this.requestImportRepo.update(requestImportId, {
  //       status: RequestImportStatus.COMPLETED,
  //     });
  //   } catch (error) {
  //     this.logger.error('Error handle import');

  //     await this.requestImportRepo.update(requestImportId, {
  //       retryTime: requestImport.retryTime + 1,
  //       error: serializeError(error),
  //     });

  //     throw error;
  //   }
  // }

  // private async handleImportListExternalReferrer(requestImport: RequestImport) {
  //   switch (requestImport.userType) {
  //     case UserType.MERCHANT:
  //       await this.referrerMerchantService.handleImport(requestImport);
  //       break;
  //     case UserType.ADMIN:
  //     case UserType.CUSTOMER:
  //       throw new Error(
  //         `Request import type admin and customer is not implemented, requestImportId=${requestImport.id}`,
  //       );
  //     default:
  //       throw new Error(
  //         `Request import type is invalid, requestImportId=${requestImport.id}`,
  //       );
  //   }
  // }

  // private async handleImportListStore(requestImport: RequestImport) {
  //   switch (requestImport.userType) {
  //     case UserType.MERCHANT:
  //       await this.storeMerchantService.handleImport(requestImport);
  //       break;
  //     case UserType.ADMIN:
  //     case UserType.CUSTOMER:
  //       throw new Error(
  //         `Request import type admin and customer is not implemented, requestImportId=${requestImport.id}`,
  //       );
  //     default:
  //       throw new Error(
  //         `Request import type is invalid, requestImportId=${requestImport.id}`,
  //       );
  //   }
  // }

  // private async handleImportListProvince(requestImport: RequestImport) {
  //   switch (requestImport.userType) {
  //     case UserType.ADMIN:
  //       await this.provinceAdminService.handleImport(requestImport);
  //       break;
  //     case UserType.MERCHANT:
  //     case UserType.CUSTOMER:
  //       throw new Error(
  //         `Request import type merchant and customer is not implemented, requestImportId=${requestImport.id}`,
  //       );
  //     default:
  //       throw new Error(
  //         `Request import type is invalid, requestImportId=${requestImport.id}`,
  //       );
  //   }
  // }

  // private async handleImportListCustomer(requestImport: RequestImport) {
  //   switch (requestImport.userType) {
  //     case UserType.MERCHANT:
  //       await this.customerMerchantService.handleImport(requestImport);
  //       break;
  //     case UserType.ADMIN:
  //     case UserType.CUSTOMER:
  //       throw new Error(
  //         `Request import type merchant and customer is not implemented, requestImportId=${requestImport.id}`,
  //       );
  //     default:
  //       throw new Error(
  //         `Request import type is invalid, requestImportId=${requestImport.id}`,
  //       );
  //   }
  // }
}
