// import { OnQueueActive, OnQueueFailed, Process, Processor } from '@nestjs/bull';
// import { Logger } from '@nestjs/common';
// import { Job } from 'bull';
// import { serializeError } from 'serialize-error';
// import { runInTransaction } from 'typeorm-transactional';
// // import {
// //   OutboxMessageProviderType,
// //   OutboxMessageStatus,
// // } from '../../external/enums/outbox-message.enum';
// // import { OutboxMessageRepository } from '../../external/repositories/outbox-message.repository';
// import { OutboxMessageJobDataDto } from '../dto/outbox-message-job-data.dto';
// import { QueueName } from '../enums/worker.enum';

// @Processor(QueueName.OUTBOX_MESSAGE)
// export class OutboxMessageProcessor {
//   private logger = new Logger(OutboxMessageProcessor.name);
//   constructor(private outboxMessageRepo: OutboxMessageRepository) {}

//   @OnQueueFailed()
//   async onFailed(job: Job<OutboxMessageJobDataDto>) {
//     const { outboxMessageId } = job.data;

//     await this.outboxMessageRepo.update(outboxMessageId, {
//       status: OutboxMessageStatus.FAILED,
//     });
//   }

//   @OnQueueActive()
//   async onActive(job: Job<OutboxMessageJobDataDto>) {
//     const { outboxMessageId } = job.data;

//     await this.outboxMessageRepo.update(outboxMessageId, {
//       status: OutboxMessageStatus.PROCESSING,
//     });
//   }

//   @Process()
//   async process(job: Job<OutboxMessageJobDataDto>) {
//     const { outboxMessageId } = job.data;

//     try {
//       await runInTransaction(async () => {
//         const outboxMessage =
//           await this.outboxMessageRepo.findOneByOrThrowNotFoundExc({
//             id: outboxMessageId,
//           });

//         switch (outboxMessage.providerType) {
//           case OutboxMessageProviderType.SF:
//             break;

//           default:
//             throw new Error('Outbox message provider type is invalid');
//         }
//       });
//     } catch (error) {
//       await this.outboxMessageRepo.update(outboxMessageId, {
//         error: serializeError(error),
//         response: error.response?.data,
//         retryTime: () => `retry_time + 1`,
//       });

//       throw error;
//     }
//   }
// }
