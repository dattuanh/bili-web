import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import dayjs from 'dayjs';
import { Transactional, runInTransaction } from 'typeorm-transactional';
// import { OutboxMessageRepository } from '../../external/repositories/outbox-message.repository';
// import { UserEvoucher } from '../../order/entities/user-evoucher.entity';
// import { UserEvoucherStatus } from '../../order/enums/user-evoucher.enum';
// import { UserEvoucherRepository } from '../../order/repositories/user-evoucher.repository';
import { UserEvoucherJobDataDto } from '../dto/user-evoucher-job-data.dto';
import { QueueName } from '../enums/worker.enum';

@Processor(QueueName.USER_EVOUCHER)
export class UserEvoucherProcessor {
  private logger = new Logger(UserEvoucherProcessor.name);
  constructor(
    // private outboxMessageRepo: OutboxMessageRepository,
    // private userEvoucherRepo: UserEvoucherRepository,
  ) {}

  @OnQueueFailed()
  async onFailed(job: Job<UserEvoucherJobDataDto>) {
    const { userEvoucherId } = job.data;

    //todo: handle failed
    console.log(`Job USER_EVOUCHER failed. JobData: ${job.data}`);
  }

  // update user evoucher status
  // @Process()
  // async process(job: Job<UserEvoucherJobDataDto>) {
  //   const { userEvoucherId } = job.data;

  //   try {
  //     await runInTransaction(async () => {
  //       const userEvoucher =
  //         await this.userEvoucherRepo.findOneOrThrowNotFoundExc({
  //           where: { id: userEvoucherId },
  //           lock: { mode: 'pessimistic_write' },
  //         });

  //       await this.processHandler(userEvoucher);
  //     });
  //   } catch (error) {
  //     console.log('error process UserEvoucher', error);

  //     throw error;
  //   }
  // }

  // @Transactional()
  // private async processHandler(userEvoucher: UserEvoucher) {
  //   const now = dayjs();

  //   if (
  //     userEvoucher.status === UserEvoucherStatus.UNUSED &&
  //     now.isAfter(userEvoucher.storingExpiresAt)
  //   ) {
  //     userEvoucher.status = UserEvoucherStatus.STORING_EXPIRED;
  //   }

  //   if (
  //     userEvoucher.status === UserEvoucherStatus.USED &&
  //     now.isAfter(userEvoucher.usingExpiresAt)
  //   ) {
  //     userEvoucher.status = UserEvoucherStatus.USING_EXPIRED;
  //   }

  //   await this.userEvoucherRepo.save(userEvoucher);
  // }
}
