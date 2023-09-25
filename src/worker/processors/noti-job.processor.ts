import {
  InjectQueue,
  OnQueueActive,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import dayjs from 'dayjs';
import { serializeError } from 'serialize-error';
import { SelectQueryBuilder } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
// import { Customer } from '../../auth/entities/customer.entity';
// import { CustomerRepository } from '../../auth/repositories/customer.repository';
import { TIME_ZONE } from '../../common/constants/global.constant';
import { chunk } from '../../common/utils';
// import { NOTI_CAMPAIGN_BIRTH_DATE_FULL_DATE_FORMAT } from '../../noti/constants/noti-campaign.constant';
// import { NotiJobNote } from '../../noti/constants/noti-job.constant';
// import {
//   NotiCampaignConfigValue,
//   NotiCampaignConfigValueBirthDate,
//   NotiCampaignConfigValueCustomerId,
//   NotiCampaignConfigValueGroupUser,
//   NotiCampaignConfigValueLastCheckIn,
//   NotiCampaignConfigValueLocation,
//   NotiCampaignConfigValueNumber,
//   NotiCampaignConfigValueNumberRange,
// } from '../../noti/dtos/common/noti-config-rule.common.dto';
// import { NotiCampaignConfig } from '../../noti/entities/noti-campaign-config.entity';
// import { NotiCampaignOperator } from '../../noti/entities/noti-campaign-operator.entity';
// import { NotiJobBatch } from '../../noti/entities/noti-job-batch.entity';
// import { NotiJob } from '../../noti/entities/noti-job.entity';
// import { NotiCampaignConditionType } from '../../noti/enums/noti-campaign-condition.enum.';
// import { NotiCampaignConfigValueBirthDateType } from '../../noti/enums/noti-campaign-config-value.enum';
// import { NotiCampaignOperatorType } from '../../noti/enums/noti-campaign-operator.enum';
// import { NotiJobBatchStatus } from '../../noti/enums/noti-job-batch.enum';
// import { NotiJobStatus } from '../../noti/enums/noti-job.enum';
// import { getDelayTimeRecurringNoti } from '../../noti/helpers/find-next-valid-recurring-send-noti-date.helper';
// import { NotiJobBatchRepository } from '../../noti/repositories/noti-job-batch.repository';
// import { NotiJobRepository } from '../../noti/repositories/noti-job.repository';
import { NotiJobBatchJobDataDto } from '../dto/noti-job-batch-job-data.dto';
import { NotiJobDataDto } from '../dto/noti-job-data.dto';

import { QueueName } from '../enums/worker.enum';

@Processor(QueueName.NOTI_JOB)
export class NotiJobProcessor {
  private logger = new Logger(NotiJobProcessor.name);
  constructor(
    @InjectQueue(QueueName.NOTI_JOB)
    private notiJobQueue: Queue<NotiJobDataDto>,
    @InjectQueue(QueueName.NOTI_JOB_BATCH)
    private notiJobBatchQueue: Queue<NotiJobBatchJobDataDto>,

    // private customerRepo: CustomerRepository,
    // private notiJobRepo: NotiJobRepository,
    // private notiJobBatchRepo: NotiJobBatchRepository,
  ) {}

  // @OnQueueFailed()
  // async onFailed(job: Job<NotiJobDataDto>) {
  //   this.logger.error(`noti_job id=${job.data.notiJobId} failed`);
  //   if (job.attemptsMade >= job.opts.attempts) {
  //     await this.notiJobRepo.update(job.data.notiJobId, {
  //       status: NotiJobStatus.FAILED,
  //     });
  //   }
  // }

  // @OnQueueActive()
  // async onActive(job: Job<NotiJobDataDto>) {
  //   const { notiJobId, version } = job.data;

  //   await this.notiJobRepo.update(
  //     { id: notiJobId, status: NotiJobStatus.PENDING },
  //     {
  //       status: NotiJobStatus.PROCESSING,
  //       version: () => `version`, //without update version
  //     },
  //   );

  //   this.logger.log(`noti_job id=${notiJobId} active`);
  // }

  // @Process()
  // async process(job: Job<NotiJobDataDto>) {
  //   const { data } = job;
  //   const { notiJobId, version } = data;

  //   try {
  //     await this.processHandler(job.data);
  //   } catch (error) {
  //     await this.notiJobRepo.update(notiJobId, {
  //       error: serializeError(error),
  //       retryTime: () => `retry_time + 1`,
  //       version: () => `version`,
  //     });

  //     throw error;
  //   }
  // }

  // @Transactional()
  // private async processHandler(jobData: NotiJobDataDto) {
  //   const { notiJobId, version } = jobData;

  //   const notiJob = await this.notiJobRepo.findOneOrThrowNotFoundExc({
  //     where: { id: notiJobId },
  //     relations: { notiCampaign: { owner: { merchant: true } } },
  //   });
  //   if (
  //     notiJob.version !== version ||
  //     notiJob.status === NotiJobStatus.DISCARDED
  //   ) {
  //     return;
  //   }

  //   const notiCampaignConfigs = notiJob.notiCampaignData.notiCampaignConfigs;
  //   const rootMerchantUserId = notiJob.notiCampaignData.ownerId;
  //   let customers: Customer[] = [];

  //   if (notiCampaignConfigs.length) {
  //     for (const notiCampaignConfig of notiCampaignConfigs) {
  //       customers = await this.handleFilterCustomer(
  //         customers,
  //         notiCampaignConfig,
  //         rootMerchantUserId,
  //       );
  //     }
  //   } else {
  //     customers = await this.customerRepo.find({
  //       where: { merchantUserId: rootMerchantUserId },
  //     });
  //   }

  //   if (!customers.length) {
  //     await this.notiJobRepo.update(notiJobId, {
  //       status: NotiJobStatus.DONE,
  //       note: NotiJobNote.CUSTOMER_NOT_FOUND,
  //     });
  //     return console.log(`notiJobId=${notiJobId} don't match any customer`);
  //   }

  //   await this.handleAddNotiJobBatch(notiJob, customers);

  //   await this.handleAddRecurringJob(notiJob);
  // }

  // private async handleAddNotiJobBatch(notiJob: NotiJob, customers: Customer[]) {
  //   const notiJobBatches: NotiJobBatch[] = [];

  //   for (const customerBatch of chunk(customers, 200)) {
  //     const notiJobBatch = this.notiJobBatchRepo.create({
  //       notiJobId: notiJob.id,
  //       status: NotiJobBatchStatus.PROCESSING,
  //       userIds: customerBatch.map((item) => item.userId),
  //     });

  //     notiJobBatches.push(notiJobBatch);
  //   }

  //   await this.notiJobBatchRepo.save(notiJobBatches, { chunk: 200 });

  //   await this.notiJobBatchQueue.addBulk(
  //     notiJobBatches.map((item) => ({
  //       data: {
  //         notiJobBatchId: item.id,
  //         version: item.version,
  //         appCode: notiJob.notiCampaign.owner.merchant.appCode,
  //       },
  //     })),
  //   );
  // }

  // private async handleAddRecurringJob(notiJob: NotiJob) {
  //   if (notiJob.notiRecurrenceData) {
  //     const nextValidDate = getDelayTimeRecurringNoti(
  //       notiJob.notiRecurrenceData,
  //     );

  //     if (nextValidDate) {
  //       const delay = nextValidDate.diff(dayjs(), 'millisecond');

  //       if (delay < 0) {
  //         throw new Error(
  //           `Invalid delay time, received=${delay}, notiCampaignId=${notiJob.notiCampaignId}`,
  //         );
  //       }

  //       const nextNotiJob = this.notiJobRepo.create({
  //         notiCampaignData: notiJob.notiCampaignData,
  //         notiCampaignId: notiJob.notiCampaignId,
  //         notiRecurrenceData: notiJob.notiRecurrenceData,
  //         status: NotiJobStatus.PENDING,
  //       });
  //       await this.notiJobRepo.insert(nextNotiJob);
  //       await this.notiJobQueue.add(
  //         { notiJobId: nextNotiJob.id, version: nextNotiJob.version },
  //         { delay },
  //       );
  //     }
  //   }
  // }

  // private async handleFilterCustomer(
  //   customers: Customer[],
  //   notiCampaignConfig: NotiCampaignConfig,
  //   rootMerchantUserId: number,
  // ): Promise<Customer[]> {
  //   const notiCondition =
  //     notiCampaignConfig.notiCampaignConfigRule.notiCampaignCondition;
  //   const notiOperator =
  //     notiCampaignConfig.notiCampaignConfigRule.notiCampaignOperator;
  //   const configValue = notiCampaignConfig.configValue;

  //   const qb = this.customerRepo
  //     .createQueryBuilder('c')
  //     .groupBy('c.id')
  //     .andWhere('c.merchantUserId = :merchantUserId', {
  //       merchantUserId: rootMerchantUserId,
  //     });

  //   if (customers.length) {
  //     qb.andWhere('c.id IN (:...customerIds)', {
  //       customerIds: customers.map((item) => item.id),
  //     });
  //   }

  //   switch (notiCondition.type) {
  //     case NotiCampaignConditionType.BIRTH_DATE:
  //       this.queryBirthDateCondition({ qb, notiOperator, configValue });
  //       break;
  //     case NotiCampaignConditionType.LAST_CHECK_IN:
  //       this.queryLastCheckInCondition({ qb, notiOperator, configValue });
  //       break;
  //     case NotiCampaignConditionType.GROUP_USER:
  //       this.queryGroupUserCondition({ qb, notiOperator, configValue });
  //       break;
  //     case NotiCampaignConditionType.LOCATION:
  //       this.queryLocationCondition({ qb, notiOperator, configValue });
  //       break;
  //     case NotiCampaignConditionType.CUSTOMER_ID:
  //       this.queryCustomerIdCondition({ qb, notiOperator, configValue });
  //       break;
  //     default:
  //       throw new Error(
  //         `NotiCampaignConditionType not implemented. Received=${notiCondition.type}`,
  //       );
  //   }

  //   return await qb.getMany();
  // }

  // private queryBirthDateCondition({
  //   qb,
  //   notiOperator,
  //   configValue,
  // }: QueryConditionParams) {
  //   switch (notiOperator.type) {
  //     case NotiCampaignOperatorType.EQUAL:
  //       this.queryBirthDateConditionEqual({ configValue, qb });
  //       break;
  //     default:
  //       throw new Error(
  //         `NotiCampaignOperatorType not implemented. Received=${notiOperator.type}`,
  //       );
  //   }
  // }

  // private queryLastCheckInCondition({
  //   qb,
  //   notiOperator,
  //   configValue,
  // }: QueryConditionParams) {
  //   const { value } = configValue as NotiCampaignConfigValueLastCheckIn;
  //   const { data } = value as NotiCampaignConfigValueNumber;
  //   const { from, to } = value as NotiCampaignConfigValueNumberRange;

  //   qb.setParameters({
  //     lastCheckInData: Number(data),
  //     lastCheckInFrom: Number(from),
  //     lastCheckInTo: Number(to),
  //   });

  //   switch (notiOperator.type) {
  //     case NotiCampaignOperatorType.EQUAL:
  //       qb.andWhere(
  //         `DATE_PART('day', now() - c.lastVisitDate) = :lastCheckInData`,
  //       );
  //       break;
  //     case NotiCampaignOperatorType.LESS_THAN:
  //       qb.andWhere(
  //         `DATE_PART('day', now() - c.lastVisitDate) < :lastCheckInData`,
  //       );
  //       break;
  //     case NotiCampaignOperatorType.MORE_THAN:
  //       qb.andWhere(
  //         `DATE_PART('day', now() - c.lastVisitDate) > :lastCheckInData`,
  //       );
  //       break;
  //     case NotiCampaignOperatorType.BETWEEN:
  //       qb.andWhere(
  //         `DATE_PART('day', now() - c.lastVisitDate) BETWEEN :lastCheckInFrom AND :lastCheckInTo`,
  //       );
  //       break;
  //     default:
  //       throw new Error(
  //         `NotiCampaignOperatorType not implemented. Received=${notiOperator.type}`,
  //       );
  //   }
  // }

  // private queryGroupUserCondition({
  //   qb,
  //   notiOperator,
  //   configValue,
  // }: QueryConditionParams) {
  //   const { value } = configValue as NotiCampaignConfigValueGroupUser;

  //   qb.innerJoin('c.user', 'u');
  //   qb.innerJoin('u.userGroupToUsers', 'ugtu');
  //   qb.innerJoin('ugtu.userGroup', 'ug');
  //   qb.setParameters({ groupUserData: Number(value.data) });

  //   switch (notiOperator.type) {
  //     case NotiCampaignOperatorType.EQUAL:
  //       qb.andWhere(`ug.id = :groupUserData`);
  //       break;
  //     default:
  //       throw new Error(
  //         `NotiCampaignOperatorType not implemented. Received=${notiOperator.type}`,
  //       );
  //   }
  // }

  // private queryLocationCondition({
  //   qb,
  //   notiOperator,
  //   configValue,
  // }: QueryConditionParams) {
  //   const { value } = configValue as NotiCampaignConfigValueLocation;

  //   qb.setParameters({ locationConditionData: value.data });

  //   switch (notiOperator.type) {
  //     case NotiCampaignOperatorType.IN:
  //       qb.andWhere(`c.provinceId IN (:...locationConditionData)`);
  //       break;
  //     default:
  //       throw new Error(
  //         `NotiCampaignOperatorType not implemented. Received=${notiOperator.type}`,
  //       );
  //   }
  // }

  // private queryBirthDateConditionEqual({
  //   configValue,
  //   qb,
  // }: Omit<QueryConditionParams, 'notiOperator'>) {
  //   const { type, value } = configValue as NotiCampaignConfigValueBirthDate;
  //   const { data } = value;
  //   let birthDateConditionEqualData: number | string;

  //   switch (type) {
  //     case NotiCampaignConfigValueBirthDateType.DATE:
  //       birthDateConditionEqualData = Number(data);
  //       qb.andWhere(
  //         `DATE_PART('day', c.birthDate) = :birthDateConditionEqualData`,
  //       );
  //       break;
  //     case NotiCampaignConfigValueBirthDateType.MONTH:
  //       birthDateConditionEqualData = Number(data);
  //       qb.andWhere(
  //         `DATE_PART('month', c.birthDate) = :birthDateConditionEqualData`,
  //       );
  //       break;
  //     case NotiCampaignConfigValueBirthDateType.YEAR:
  //       birthDateConditionEqualData = Number(data);
  //       qb.andWhere(
  //         `DATE_PART('year', c.birthDate) = :birthDateConditionEqualData`,
  //       );
  //       break;
  //     case NotiCampaignConfigValueBirthDateType.FULL_DATE:
  //       birthDateConditionEqualData = dayjs(
  //         data,
  //         NOTI_CAMPAIGN_BIRTH_DATE_FULL_DATE_FORMAT,
  //         TIME_ZONE,
  //         true,
  //       ).toISOString();

  //       qb.andWhere(`DATE(c.birthDate) = DATE(:birthDateConditionEqualData)`);
  //       break;
  //     default:
  //       throw new Error(
  //         `NotiCampaignConfigValueBirthDateType is not implemented. Received=${type}`,
  //       );
  //   }

  //   qb.setParameters({ birthDateConditionEqualData });
  // }

  // private queryCustomerIdCondition({
  //   qb,
  //   notiOperator,
  //   configValue,
  // }: QueryConditionParams) {
  //   const { value } = configValue as NotiCampaignConfigValueCustomerId;

  //   qb.setParameters({ customerIds: value.data });

  //   switch (notiOperator.type) {
  //     case NotiCampaignOperatorType.IN:
  //       qb.andWhere(`c.id IN (:...customerIds)`);
  //       break;
  //     default:
  //       throw new Error(
  //         `NotiCampaignOperatorType not implemented. Received=${notiOperator.type}`,
  //       );
  //   }
  // }
}

// type QueryConditionParams = {
//   qb: SelectQueryBuilder<Customer>;
//   notiOperator: NotiCampaignOperator;
//   configValue: NotiCampaignConfigValue;
// };
