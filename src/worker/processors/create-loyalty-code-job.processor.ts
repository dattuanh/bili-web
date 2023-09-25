import {
  InjectQueue,
  OnQueueActive,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { serializeError } from 'serialize-error';
import { Transactional } from 'typeorm-transactional';
import { NotFoundExc } from '../../common/exceptions/custom.exception';
// import { LoyaltyCodeJobType } from '../../loyalty-code/enums/loyalty-code-job.enum';
// import { LoyaltyCodeJobStatus } from '../../loyalty-code/enums/loyalty-code.enum';
// import { LoyaltyCodeGroupStatus } from '../../loyalty-code/enums/loyalty-code.group.enum';
// import { LoyaltyCodeGroupRepository } from '../../loyalty-code/repositories/loyalty-code-group.repository';
// import { LoyaltyCodeJobRepository } from '../../loyalty-code/repositories/loyalty-code-job.repository';
// import { LoyaltyCodeRepository } from '../../loyalty-code/repositories/loyalty-code.repository';
// import { LoyaltyCodeJobMerchantService } from '../../loyalty-code/services/merchant/loyalty-code-job.merchant.service';
import { CreateLoyaltyCodeJobDataDto } from '../dto/loyalty-code-job.data.dto';
import { QueueName } from '../enums/worker.enum';

@Processor(QueueName.CREATE_LOYALTY_CODE_JOB)
export class CreateLoyaltyCodeJobProcessor {
  private logger = new Logger(CreateLoyaltyCodeJobProcessor.name);
  constructor(
    @InjectQueue(QueueName.CREATE_LOYALTY_CODE_JOB)
    private loyaltyCodeJobQueue: Queue<CreateLoyaltyCodeJobDataDto>,
    // private loyaltyCodeJobMerchantSer: LoyaltyCodeJobMerchantService,

    // private loyaltyCodeJobRepo: LoyaltyCodeJobRepository,
    // private loyaltyCodeRepo: LoyaltyCodeRepository,
    // private loyaltyCodeGroupRepo: LoyaltyCodeGroupRepository,
  ) {}

  // @OnQueueFailed()
  // async onFailed(job: Job<CreateLoyaltyCodeJobDataDto>) {
  //   const { loyaltyCodeGroupId } = job.data;
  //   this.logger.error(
  //     `create loyaltyCodeGroupId id=${loyaltyCodeGroupId} failed`,
  //   );
  //   if (job.attemptsMade >= job.opts.attempts) {
  //     await Promise.all([
  //       this.loyaltyCodeJobRepo.update(
  //         { loyaltyCodeGroupId, type: LoyaltyCodeJobType.CREATE },
  //         { status: LoyaltyCodeJobStatus.FAILED },
  //       ),
  //       this.loyaltyCodeGroupRepo.update(loyaltyCodeGroupId, {
  //         status: LoyaltyCodeGroupStatus.GENERATION_FAILED,
  //         version: () => `version`,
  //       }),
  //     ]);
  //   }
  // }

  // @OnQueueActive()
  // async onActive(job: Job<CreateLoyaltyCodeJobDataDto>) {
  //   const { loyaltyCodeGroupId } = job.data;
  //   await this.loyaltyCodeJobRepo.update(
  //     {
  //       loyaltyCodeGroupId,
  //       status: LoyaltyCodeJobStatus.PENDING,
  //       type: LoyaltyCodeJobType.CREATE,
  //     },
  //     { status: LoyaltyCodeJobStatus.PROCESSING },
  //   );

  //   this.logger.log(
  //     `create loyaltyCodeGroupId id=${loyaltyCodeGroupId} active`,
  //   );
  // }

  // @Process()
  // async process(job: Job<CreateLoyaltyCodeJobDataDto>) {
  //   const { data } = job;
  //   const { loyaltyCodeGroupId } = data;

  //   try {
  //     await this.processGenerateLoyaltyCode(job);
  //   } catch (error) {
  //     await this.loyaltyCodeJobRepo.update(
  //       { loyaltyCodeGroupId, type: LoyaltyCodeJobType.CREATE },
  //       {
  //         error: serializeError(error),
  //         retryTime: () => `retry_time + 1`,
  //         version: () => `version`,
  //       },
  //     );
  //     throw error;
  //   }
  // }

  // @Transactional()
  // private async processGenerateLoyaltyCode(
  //   jobData: Job<CreateLoyaltyCodeJobDataDto>,
  // ) {
  //   const { loyaltyCodeGroupId, amount } = jobData.data;

  //   const loyaltyCodeGroup = await this.loyaltyCodeGroupRepo
  //     .createQueryBuilder('lcg')
  //     .andWhere('lcg.id = :loyaltyCodeGroupId', { loyaltyCodeGroupId })
  //     .setLock('pessimistic_write')
  //     .getOne();

  //   if (!loyaltyCodeGroup)
  //     throw new NotFoundExc({
  //       message: ['common.word.loyaltyCodeJob', 'common.word.notFound'],
  //     });

  //   await this.loyaltyCodeJobMerchantSer.genLoyaltyCode(
  //     loyaltyCodeGroup,
  //     amount,
  //   );

  //   await Promise.all([
  //     this.loyaltyCodeJobRepo.update(
  //       { loyaltyCodeGroupId, type: LoyaltyCodeJobType.CREATE },
  //       { status: LoyaltyCodeJobStatus.DONE },
  //     ),
  //     this.loyaltyCodeGroupRepo.update(
  //       { id: loyaltyCodeGroup.id },
  //       { status: LoyaltyCodeGroupStatus.ACTIVE, version: () => `version` },
  //     ),
  //   ]);
  // }
}
