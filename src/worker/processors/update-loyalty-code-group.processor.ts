import { OnQueueActive, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import dayjs from 'dayjs';
import { serializeError } from 'serialize-error';
import { Transactional } from 'typeorm-transactional';
// import { LoyaltyCodeJobType } from '../../loyalty-code/enums/loyalty-code-job.enum';
// import { LoyaltyCodeGroupStatus } from '../../loyalty-code/enums/loyalty-code.group.enum';
// import { LoyaltyCodeGroupRepository } from '../../loyalty-code/repositories/loyalty-code-group.repository';
// import { LoyaltyCodeJobRepository } from '../../loyalty-code/repositories/loyalty-code-job.repository';
import { UpdateLoyaltyCodeGroupJobDataDto } from '../dto/loyalty-code-job.data.dto';
import { QueueName } from '../enums/worker.enum';

@Processor(QueueName.UPDATE_LOYALTY_CODE_GROUP)
export class UpdateLoyaltyCodeGroupProcessor {
  private logger = new Logger(UpdateLoyaltyCodeGroupProcessor.name);
  constructor(
    // private loyaltyCodeGroupRepo: LoyaltyCodeGroupRepository,
    // private loyaltyCodeJobRepo: LoyaltyCodeJobRepository,
  ) {}

  @OnQueueFailed()
  async onFailed(job: Job<UpdateLoyaltyCodeGroupJobDataDto>) {
    this.logger.error(
      `update_loyalty_code_group id=${job.data.loyaltyCodeGroupId} failed`,
    );
  }

  @OnQueueActive()
  async onActive(job: Job<UpdateLoyaltyCodeGroupJobDataDto>) {
    const { loyaltyCodeGroupId } = job.data;
    this.logger.log(
      `update_loyalty_code_group id=${loyaltyCodeGroupId} active`,
    );
  }

  // @Process()
  // async process(job: Job<UpdateLoyaltyCodeGroupJobDataDto>) {
  //   try {
  //     await this.processExpiredCodeHandler(job.data);
  //   } catch (error) {
  //     await this.loyaltyCodeJobRepo.update(
  //       {
  //         loyaltyCodeGroupId: job.data.loyaltyCodeGroupId,
  //         type: LoyaltyCodeJobType.UPDATE,
  //       },
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
  // private async processExpiredCodeHandler(
  //   dto: UpdateLoyaltyCodeGroupJobDataDto,
  // ) {
  //   const { loyaltyCodeGroupId, loyaltyCodeGroupVersion } = dto;

  //   const loyaltyCodeGroup =
  //     await this.loyaltyCodeGroupRepo.findOneOrThrowNotFoundExc({
  //       where: { id: loyaltyCodeGroupId },
  //       lock: { mode: 'pessimistic_write' },
  //     });
  //   if (loyaltyCodeGroup.version !== loyaltyCodeGroupVersion) return;

  //   if (dayjs().isAfter(loyaltyCodeGroup.expiredDate)) {
  //     await this.loyaltyCodeGroupRepo.update(loyaltyCodeGroup.id, {
  //       status: LoyaltyCodeGroupStatus.EXPIRED,
  //     });
  //   }
  // }
}
