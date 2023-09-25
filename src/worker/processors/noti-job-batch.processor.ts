import { InjectRedis } from '@liaoliaots/nestjs-redis';
import {
  InjectQueue,
  OnQueueActive,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job, Queue } from 'bull';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';
import Redis from 'ioredis';
import { serializeError } from 'serialize-error';
import { In, Not } from 'typeorm';
import { Transactional, runOnTransactionCommit } from 'typeorm-transactional';
// import { Customer } from '../../auth/entities/customer.entity';
// import { Merchant } from '../../auth/entities/merchant.entity';
import { UserType } from '../../auth/enums/user.enum';
// import { CustomerRepository } from '../../auth/repositories/customer.repository';
// import { MerchantRepository } from '../../auth/repositories/merchant.repository';
import { AppConfig } from '../../common/config/app.config';
import { RedisNamespace } from '../../common/config/redis.config';
import { AppEnvironment } from '../../common/enums/app.enum';
import { isNullOrUndefined } from '../../common/utils';
// import { UserHistoryCredit } from '../../credit/entities/user-history-credit.entity';
// import { UserHistoryCreditAction } from '../../credit/enums/user-history-credit.enum';
// import { UserCreditRepository } from '../../credit/repositories/user-credit.repository';
// import { UserHistoryCreditRepository } from '../../credit/repositories/user-history-credit.repository';
// import { SendZnsZaloReqDto } from '../../external/dtos/zalo/req/zns.zalo.req.dto';
// import {
//   SendZnsBulkResult,
//   ZaloZnsService,
// } from '../../external/services/zalo/zalo-zns.service';
// import { NotiCampaignChannel } from '../../noti/entities/noti-campaign-channel.entity';
// import { NotiCampaign } from '../../noti/entities/noti-campaign.entity';
// import {
//   NotiJobBatch,
//   SendResult,
// } from '../../noti/entities/noti-job-batch.entity';
// import { NotiToUser } from '../../noti/entities/noti-to-user.entity';
// import { ZnsTemplate } from '../../noti/entities/zns-template.entity';
// import { NotiCampaignChannelType } from '../../noti/enums/noti-campaign-channel.enum';
// import { NotiJobBatchStatus } from '../../noti/enums/noti-job-batch.enum';
// import { NotiJobStatus } from '../../noti/enums/noti-job.enum';
// import { NotiJobBatchRepository } from '../../noti/repositories/noti-job-batch.repository';
// import { NotiJobRepository } from '../../noti/repositories/noti-job.repository';
// import { NotiToUserRepository } from '../../noti/repositories/noti-to-user.repository';
// import { NotiRepository } from '../../noti/repositories/noti.repository';
// import { PushNotiFcmService } from '../../noti/services/common/push-noti-fcm.service';
// import { RenderNotiService } from '../../noti/services/common/render-noti.service';
// import { SecretKey } from '../../system-config/enums/secret.enum';
// import { SecretRepository } from '../../system-config/repositories/secret.repository';
// import { UserTransactionLockType } from '../../utils/enums/user-transaction-lock.enum';
import { RedisKeyService } from '../../utils/services/redis-key.service';
import { UtilService } from '../../utils/services/util.service';
import { UuidService } from '../../utils/services/uuid.service';
import { NotiJobBatchJobDataDto } from '../dto/noti-job-batch-job-data.dto';
import { QueueName } from '../enums/worker.enum';

@Processor(QueueName.NOTI_JOB_BATCH)
export class NotiJobBatchProcessor {
  private logger = new Logger(NotiJobBatchProcessor.name);
  constructor(
    @InjectQueue(QueueName.NOTI_JOB_BATCH)
    private notiJobBatchQueue: Queue<NotiJobBatchJobDataDto>,
    @InjectRedis(RedisNamespace.MASTER_NS) private redisMaster: Redis,
    @InjectRedis(RedisNamespace.SLAVE_NS) private redisSlave: Redis,
    // private pushNotiFcmService: PushNotiFcmService,
    // private renderNotiSer: RenderNotiService,
    // private zaloZnsService: ZaloZnsService,
    private uuidService: UuidService,
    private configService: ConfigService<AppConfig>,
    private utilSer: UtilService,
    private redisKeySer: RedisKeyService,

    // private notiRepo: NotiRepository,
    // private notiToUserRepo: NotiToUserRepository,
    // private customerRepo: CustomerRepository,
    // private notiJobRepo: NotiJobRepository,
    // private notiJobBatchRepo: NotiJobBatchRepository,
    // private merchantRepo: MerchantRepository,
    // private userCreditRepo: UserCreditRepository,
    // private userHistoryCreditRepo: UserHistoryCreditRepository,
    // private secretRepo: SecretRepository,
  ) {}

  // @OnQueueFailed()
  // async onFailed(job: Job<NotiJobBatchJobDataDto>) {
  //   this.logger.error(`noti_job_batch id=${job.data.notiJobBatchId} failed`);

  //   if (job.attemptsMade >= job.opts.attempts) {
  //     await this.notiJobBatchRepo.update(job.data.notiJobBatchId, {
  //       status: NotiJobBatchStatus.FAILED,
  //     });
  //   }
  // }

  @OnQueueActive()
  async onActive(job: Job<NotiJobBatchJobDataDto>) {
    this.logger.log(`noti_job_batch id=${job.data.notiJobBatchId} active`);
  }

  // @Process({ concurrency: 1 })
  // async process(job: Job<NotiJobBatchJobDataDto>) {
  //   const { data } = job;
  //   const { notiJobBatchId, version } = data;

  //   try {
  //     await this.processHandler(job.data);
  //   } catch (error) {
  //     await this.notiJobBatchRepo.update(notiJobBatchId, {
  //       error: serializeError(error),
  //       retryTime: () => `retry_time + 1`,
  //       version: () => `version`,
  //     });
  //     console.log('error process noti job batch', error);
  //     throw error;
  //   }
  // }

  // @Transactional()
  // async processHandler(jobData: NotiJobBatchJobDataDto) {
  //   const { notiJobBatchId, appCode, version } = jobData;

  //   const { notiJobBatch, isValid } = await this.getAndCheckNotiJobBatch(
  //     jobData,
  //   );
  //   if (!isValid) return;

  //   const notiCampaign = notiJobBatch.notiJob.notiCampaignData;

  //   await this.utilSer.lockConcurrency(
  //     notiCampaign.ownerId,
  //     UserTransactionLockType.CREDIT,
  //   );

  //   const [customers, rootMerchant] = await Promise.all([
  //     this.customerRepo.findBy({
  //       userId: In(notiJobBatch.userIds),
  //     }),
  //     this.merchantRepo.findOneByOrThrowNotFoundExc({
  //       userId: notiCampaign.ownerId,
  //     }),
  //   ]);

  //   await this.notiJobBatchRepo.update(notiJobBatch.id, {
  //     status: NotiJobBatchStatus.DONE,
  //   });
  //   runOnTransactionCommit(() => {
  //     this.handleNotiJobDone(notiJobBatch.notiJobId);
  //   });

  //   switch (notiCampaign.notiCampaignChannel.type) {
  //     case NotiCampaignChannelType.NOTI_PUSH:
  //       await this.handlePushNotiFcm({
  //         customers,
  //         notiJobBatch,
  //         notiCampaign,
  //         appCode,
  //         rootMerchant,
  //       });
  //       break;

  //     case NotiCampaignChannelType.ZNS:
  //       await this.handlePushNotiZns({
  //         customers,
  //         notiJobBatch,
  //         notiCampaign,
  //         appCode,
  //         rootMerchant,
  //       });
  //       break;

  //     case NotiCampaignChannelType.SMS:
  //     default:
  //       throw new Error(
  //         `NotiCampaignChannelType is not valid. Received=${notiCampaign.notiCampaignChannel.type}`,
  //       );
  //   }
  // }

  // private async getAndCheckNotiJobBatch(jobData: NotiJobBatchJobDataDto) {
  //   const { notiJobBatchId, version } = jobData;

  //   const notiJobBatch = await this.notiJobBatchRepo
  //     .createQueryBuilder('njb')
  //     .where('njb.id = :id', { id: notiJobBatchId })
  //     .setLock('pessimistic_write')
  //     .getOneOrFail();

  //   const notiJob = await this.notiJobRepo.findOneByOrThrowNotFoundExc({
  //     id: notiJobBatch.notiJobId,
  //   });
  //   notiJobBatch.notiJob = notiJob;

  //   if (
  //     notiJobBatch.version !== version ||
  //     notiJobBatch.status === NotiJobBatchStatus.DISCARDED
  //   ) {
  //     await this.notiJobBatchRepo.update(
  //       { id: notiJobBatchId },
  //       {
  //         note: `Invalid version. Job version: ${version}, current version: ${notiJobBatch.version}`,
  //         version: () => `version`,
  //       },
  //     );
  //     return { isValid: false };
  //   }

  //   return { notiJobBatch, isValid: true };
  // }

  // private async handleNotiJobDone(notiJobId: number) {
  //   try {
  //     const existJobBatchNotDone = await this.notiJobBatchRepo.exist({
  //       where: {
  //         status: Not(NotiJobBatchStatus.DONE),
  //         notiJobId: notiJobId,
  //       },
  //     });

  //     if (!existJobBatchNotDone) {
  //       await this.notiJobRepo.update(notiJobId, {
  //         status: NotiJobStatus.DONE,
  //       });
  //     }
  //   } catch (error) {
  //     console.log('error handleNotiJobDone', error);
  //   }
  // }

  // @Transactional()
  // private async handlePushNotiFcm(params: HandlePushNotiFcmParams) {
  //   const { customers, notiJobBatch, notiCampaign, appCode, rootMerchant } =
  //     params;
  //   const { notiCampaignChannel, notiTemplate } = notiCampaign;

  //   const noti = this.notiRepo.create({
  //     link: notiTemplate.link,
  //     metaData: notiTemplate.metaData,
  //     notiDisplayTemplateId: notiCampaignChannel.notiDisplayTemplateId,
  //     ownerId: notiTemplate.ownerId,
  //     params: notiCampaign.params,
  //     routeType: notiTemplate.routeType,
  //     type: notiTemplate.type,
  //     timeSent: new Date(),
  //     channelType: NotiCampaignChannelType.NOTI_PUSH,
  //   });
  //   await this.notiRepo.insert(noti);

  //   const notiData: { message: Message; customer: Customer }[] = [];
  //   const notiToUsers: NotiToUser[] = [];

  //   for (const customer of customers) {
  //     const { content, title } = this.renderNotiSer.render({
  //       channelType: NotiCampaignChannelType.NOTI_PUSH,
  //       brandName: rootMerchant.brandName,
  //       customer,
  //       noti,
  //       notiPush: {
  //         notiDisplayTemplate: notiCampaignChannel.notiDisplayTemplate,
  //         notiDisplayTemplateDetails:
  //           notiCampaignChannel.notiDisplayTemplate.notiDisplayTemplateDetails,
  //       },
  //       userType: UserType.CUSTOMER,
  //     });

  //     const notiToUser = this.notiToUserRepo.create({
  //       userId: customer.userId,
  //       isRead: false,
  //       notiId: noti.id,
  //     });
  //     notiToUsers.push(notiToUser);

  //     if (!customer.deviceTokens?.length) continue;

  //     const lastToken = customer.deviceTokens[customer.deviceTokens.length - 1];
  //     notiData.push({
  //       message: { token: lastToken, data: { appCode, body: content, title } },
  //       customer,
  //     });
  //   }

  //   await this.notiToUserRepo.save(notiToUsers, { chunk: 1000 });

  //   const pushFcmResult = await this.pushNotiFcmService.pushNotiV2(
  //     notiData.map((item) => item.message),
  //   );

  //   runOnTransactionCommit(async () => {
  //     try {
  //       const succeedResults: SendResult = [];
  //       const failedResults: SendResult = [];

  //       pushFcmResult.forEach((item, idx) => {
  //         const userId = notiData[idx].customer.userId;
  //         if (item.success)
  //           succeedResults.push({ userId, data: item, type: 'FCM' });
  //         else failedResults.push({ userId, data: item, type: 'FCM' });
  //       });

  //       await this.notiJobBatchRepo.update(
  //         { id: notiJobBatch.id, status: NotiJobBatchStatus.DONE },
  //         { succeedResults, failedResults, version: () => `version` },
  //       );
  //     } catch (error) {
  //       console.log('error when update fcm result', error);
  //       await this.notiJobBatchRepo.update(
  //         { id: notiJobBatch.id },
  //         { error: serializeError(error) },
  //       );
  //     }
  //   });

  //   return notiToUsers;
  // }

  // @Transactional()
  // private async handlePushNotiZns(params: HandlePushNotiZnsParams) {
  //   const { customers, notiJobBatch, rootMerchant, notiCampaign } = params;
  //   const { notiCampaignChannel } = notiCampaign;
  //   const znsTemplate = notiCampaignChannel.znsTemplate;

  //   const {
  //     eligibleCustomers,
  //     ineligibleCustomersByCredit,
  //     ineligibleCustomersByQuota,
  //     currentMerchantZnsQuota,
  //   } = await this.checkAndSubtractQuotaAndClassifyCustomer({
  //     customers,
  //     rootMerchant,
  //     notiCampaign,
  //     notiCampaignChannel,
  //   });

  //   if (!eligibleCustomers.length) {
  //     await this.handleNotEligibleCustomer(
  //       ineligibleCustomersByCredit,
  //       ineligibleCustomersByQuota,
  //       notiJobBatch,
  //     );
  //     return;
  //   }

  //   const znsReqDto = await this.saveEntityZnsAndMapToZnsReqDto(
  //     eligibleCustomers,
  //     params,
  //   );

  //   const sendZnsBulkResult = await this.performSendZnsNoti(
  //     znsReqDto,
  //     rootMerchant,
  //     notiCampaignChannel,
  //   );

  //   const userHistoryCredit = await this.subtractZnsCredit({
  //     sendZnsBulkResult,
  //     znsTemplate,
  //     notiCampaign,
  //     notiCampaignChannel,
  //   });

  //   await this.handleSaveResultSendZns({
  //     sendZnsBulkResult,
  //     notiData: znsReqDto,
  //     notiJobBatch,
  //     rootMerchant: rootMerchant,
  //     userHistoryCredit,
  //     ineligibleCustomersByCredit,
  //     ineligibleCustomersByQuota,
  //     currentMerchantZnsQuota,
  //     notiCampaignChannel,
  //   });
  // }

  // private async performSendZnsNoti(
  //   znsReqDto: ZnsReqDto[],
  //   rootMerchant: Merchant,
  //   notiCampaignChannel: NotiCampaignChannel,
  // ) {
  //   const dbSecretKey = this.configService.get('databaseSecretKey');

  //   if (notiCampaignChannel.isUseMerchantZaloOA) {
  //     const accessToken = await this.secretRepo.findOneAndDecrypt(
  //       rootMerchant.userId,
  //       SecretKey.ZALO_ACCESS_TOKEN,
  //       dbSecretKey,
  //     );
  //     console.log('accessToken', accessToken);
  //     return this.zaloZnsService.sendZnsBulkByMerchantOA(
  //       { data: znsReqDto.map((item) => item.dto) },
  //       accessToken.value,
  //     );
  //   } else {
  //     return this.zaloZnsService.sendZnsBulk({
  //       data: znsReqDto.map((item) => item.dto),
  //     });
  //   }
  // }

  // private async checkAndSubtractQuotaAndClassifyCustomer(
  //   params: CheckAndSubtractQuotaAndClassifyCustomerParams,
  // ) {
  //   const { customers, notiCampaign, rootMerchant, notiCampaignChannel } =
  //     params;

  //   let maxZnsCanSendByCredit: number;
  //   if (notiCampaignChannel.isUseMerchantZaloOA) {
  //     maxZnsCanSendByCredit = Infinity;
  //   } else {
  //     maxZnsCanSendByCredit = await this.calAmountNotiByCredit(notiCampaign);
  //   }

  //   let eligibleCustomers = customers.slice(0, maxZnsCanSendByCredit);
  //   const ineligibleCustomersByCredit = customers.slice(maxZnsCanSendByCredit);
  //   let ineligibleCustomersByQuota = [];

  //   const { maxZnsCanSendByQuota, currentMerchantZnsQuota } =
  //     await this.calAmountNotiByQuota(
  //       rootMerchant,
  //       notiCampaignChannel.isUseMerchantZaloOA,
  //     );

  //   ineligibleCustomersByQuota = eligibleCustomers.slice(maxZnsCanSendByQuota);
  //   eligibleCustomers = eligibleCustomers.slice(0, maxZnsCanSendByQuota);

  //   return {
  //     eligibleCustomers,
  //     ineligibleCustomersByCredit,
  //     ineligibleCustomersByQuota,
  //     currentMerchantZnsQuota,
  //   };
  // }

  // private async calAmountNotiByCredit(notiCampaign: NotiCampaign) {
  //   if (notiCampaign.notiCampaignChannel.type !== NotiCampaignChannelType.ZNS)
  //     return;

  //   const creditEachNoti = notiCampaign.notiCampaignChannel.znsTemplate.credit;

  //   if (!creditEachNoti) return Infinity;

  //   const userCredit = await this.userCreditRepo.findOneByOrThrowNotFoundExc({
  //     userId: notiCampaign.ownerId,
  //   });

  //   const amountNotiCanSend = Math.floor(
  //     userCredit.totalCredits / creditEachNoti,
  //   );

  //   return amountNotiCanSend;
  // }

  // private async calAmountNotiByQuota(
  //   rootMerchant: Merchant,
  //   isUseMerchantZaloOA: boolean,
  // ): Promise<CalAmountNotiCanSendByQuotaResult> {
  //   if (isUseMerchantZaloOA) {
  //     return { maxZnsCanSendByQuota: Infinity };
  //   }

  //   const merchantZnsNotiQuotaKey = this.redisKeySer.merchantZnsNotiQuotaKey();
  //   const defaultQuotaEachMerchant = this.configService.get(
  //     'zalo.zns.defaultQuotaEachMerchant',
  //   );

  //   const [biliZnsQuota, merchantQuotaRaw] = await Promise.all([
  //     this.zaloZnsService.getZnsQuota(),
  //     this.redisSlave.hget(
  //       merchantZnsNotiQuotaKey,
  //       rootMerchant.userId.toString(),
  //     ),
  //   ]);

  //   const currentBiliZnsQuota = biliZnsQuota.data?.remainingQuota || 0;
  //   const currentMerchantZnsQuota = isNullOrUndefined(merchantQuotaRaw)
  //     ? Number(defaultQuotaEachMerchant)
  //     : Number(merchantQuotaRaw);

  //   let maxZnsCanSendByQuota = Math.floor(
  //     Math.min(currentBiliZnsQuota, currentMerchantZnsQuota),
  //   );
  //   if (maxZnsCanSendByQuota < 0) maxZnsCanSendByQuota = 0;
  //   return { maxZnsCanSendByQuota, currentMerchantZnsQuota };
  // }

  // private async handleNotEligibleCustomer(
  //   ineligibleCustomersByCredit: Customer[],
  //   ineligibleCustomersByQuota: Customer[],
  //   notiJobBatch: NotiJobBatch,
  // ) {
  //   const failedResults: SendResult = [];

  //   for (const item of ineligibleCustomersByCredit) {
  //     failedResults.push({
  //       userId: item.userId,
  //       type: 'EXCEED_CREDIT',
  //     });
  //   }
  //   for (const item of ineligibleCustomersByQuota) {
  //     failedResults.push({
  //       userId: item.userId,
  //       type: 'EXCEED_QUOTA',
  //     });
  //   }

  //   await this.notiJobBatchRepo.update(
  //     { id: notiJobBatch.id, status: NotiJobBatchStatus.DONE },
  //     { failedResults, note: 'Exceed quota or credit' },
  //   );
  // }

  // private async saveEntityZnsAndMapToZnsReqDto(
  //   eligibleCustomers: Customer[],
  //   params: HandlePushNotiZnsParams,
  // ) {
  //   const { notiCampaign, rootMerchant } = params;
  //   const { notiCampaignChannel, notiTemplate } = notiCampaign;
  //   const templateId = notiCampaignChannel.znsTemplate.znsTemplateId;

  //   const noti = this.notiRepo.create({
  //     link: notiTemplate.link,
  //     metaData: notiTemplate.metaData,
  //     ownerId: notiTemplate.ownerId,
  //     params: notiCampaign.params,
  //     routeType: notiTemplate.routeType,
  //     type: notiTemplate.type,
  //     timeSent: new Date(),
  //     znsTemplateId: notiCampaignChannel.znsTemplateId,
  //     channelType: NotiCampaignChannelType.ZNS,
  //   });
  //   await this.notiRepo.insert(noti);

  //   const znsPrepareDtos: ZnsReqDto[] = [];
  //   const notiToUsers: NotiToUser[] = [];
  //   const mode =
  //     this.configService.getOrThrow('environment') !== AppEnvironment.PRODUCTION
  //       ? 'development'
  //       : undefined;

  //   for (const customer of eligibleCustomers) {
  //     const notiToUser = this.notiToUserRepo.create({
  //       userId: customer.userId,
  //       isRead: false,
  //       notiId: noti.id,
  //     });
  //     notiToUsers.push(notiToUser);

  //     znsPrepareDtos.push({
  //       customer,
  //       dto: {
  //         phone: customer.phoneNumber,
  //         tracking_id: this.uuidService.genRandomStr(),
  //         template_id: templateId,
  //         template_data: {
  //           ...notiCampaign.params,
  //           merchantName: rootMerchant.brandName,
  //           customerName: customer.name,
  //         },
  //         mode,
  //       },
  //     });
  //   }

  //   await this.notiToUserRepo.save(notiToUsers, { chunk: 1000 });

  //   return znsPrepareDtos;
  // }

  // private async subtractZnsCredit(params: SubtractZnsCredit) {
  //   const {
  //     notiCampaign,
  //     sendZnsBulkResult,
  //     znsTemplate,
  //     notiCampaignChannel,
  //   } = params;

  //   if (notiCampaignChannel.isUseMerchantZaloOA) return;

  //   let succeededCount = 0;
  //   for (const item of sendZnsBulkResult) {
  //     if (item.status === 'successful') succeededCount += 1;
  //   }

  //   const creditConsumption = succeededCount * znsTemplate.credit;
  //   const userHistoryCredit = this.userHistoryCreditRepo.create({
  //     action: UserHistoryCreditAction.SPEND_CREDIT,
  //     userId: notiCampaign.ownerId,
  //     credit: creditConsumption,
  //   });
  //   await this.userHistoryCreditRepo.insert(userHistoryCredit);

  //   return userHistoryCredit;
  // }

  // private async handleSaveResultSendZns(params: SaveResultSendZnsParams) {
  //   const {
  //     notiData,
  //     notiJobBatch,
  //     sendZnsBulkResult,
  //     rootMerchant,
  //     userHistoryCredit,
  //     ineligibleCustomersByCredit,
  //     ineligibleCustomersByQuota,
  //     currentMerchantZnsQuota,
  //     notiCampaignChannel,
  //   } = params;

  //   try {
  //     const succeedResults: SendResult = [];
  //     const failedResults: SendResult = [];

  //     sendZnsBulkResult.forEach((item, idx) => {
  //       const userId = notiData[idx].customer.userId;
  //       if (item.status === 'successful')
  //         succeedResults.push({ userId, data: item, type: 'ZNS' });
  //       else failedResults.push({ userId, data: item, type: 'ZNS' });
  //     });
  //     ineligibleCustomersByCredit.forEach((item) =>
  //       failedResults.push({ type: 'EXCEED_CREDIT', userId: item.userId }),
  //     );
  //     ineligibleCustomersByQuota.forEach((item) =>
  //       failedResults.push({ type: 'EXCEED_QUOTA', userId: item.userId }),
  //     );

  //     await Promise.all([
  //       !notiCampaignChannel.isUseMerchantZaloOA &&
  //         this.redisMaster.hset(
  //           this.redisKeySer.merchantZnsNotiQuotaKey(),
  //           rootMerchant.userId.toString(),
  //           currentMerchantZnsQuota - succeedResults.length,
  //         ),
  //       this.notiJobBatchRepo.update(
  //         { id: notiJobBatch.id, status: NotiJobBatchStatus.DONE },
  //         {
  //           succeedResults,
  //           failedResults,
  //           userHistoryCreditId: userHistoryCredit?.id,
  //         },
  //       ),
  //     ]);
  //   } catch (error) {
  //     console.log('error when update zns result', error);
  //     await this.notiJobBatchRepo.update(
  //       { id: notiJobBatch.id },
  //       {
  //         error: serializeError(error),
  //         status: NotiJobBatchStatus.FAILED,
  //         note: 'Error when executing function handleSaveResultSendZns',
  //       },
  //     );
  //   }
  // }
}

// type HandlePushNotiFcmParams = {
//   customers: Customer[];
//   notiJobBatch: NotiJobBatch;
//   notiCampaign: NotiCampaign;
//   appCode: string;
//   rootMerchant: Merchant;
// };

// type HandlePushNotiZnsParams = {
//   customers: Customer[];
//   notiJobBatch: NotiJobBatch;
//   notiCampaign: NotiCampaign;
//   appCode: string;
//   rootMerchant: Merchant;
// };

// type ZnsReqDto = { dto: SendZnsZaloReqDto; customer: Customer };

// type SaveResultSendZnsParams = {
//   sendZnsBulkResult: SendZnsBulkResult;
//   notiData: ZnsReqDto[];
//   notiJobBatch: NotiJobBatch;
//   ineligibleCustomersByQuota: Customer[];
//   ineligibleCustomersByCredit: Customer[];
//   rootMerchant: Merchant;
//   userHistoryCredit?: UserHistoryCredit;
//   currentMerchantZnsQuota: number;
//   notiCampaignChannel: NotiCampaignChannel;
// };

// type CheckAndSubtractQuotaAndClassifyCustomerParams = {
//   customers: Customer[];
//   rootMerchant: Merchant;
//   notiCampaign: NotiCampaign;
//   notiCampaignChannel: NotiCampaignChannel;
// };

type CalAmountNotiCanSendByQuotaResult = {
  maxZnsCanSendByQuota: number;
  currentMerchantZnsQuota?: number;
};

// type SubtractZnsCredit = {
//   sendZnsBulkResult: SendZnsBulkResult;
//   znsTemplate: ZnsTemplate;
//   notiCampaign: NotiCampaign;
//   notiCampaignChannel: NotiCampaignChannel;
// };
