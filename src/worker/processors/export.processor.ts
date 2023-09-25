// import { OnQueueActive, OnQueueFailed, Process, Processor } from '@nestjs/bull';
// import { Logger } from '@nestjs/common';
// import { Job } from 'bull';
// import { serializeError } from 'serialize-error';
// // import { ExportListCustomerMerchantReqDto } from '../../auth/dtos/merchant/req/customer.merchant.req.dto';
// import { UserType } from '../../auth/enums/user.enum';
// // import { CustomerMerchantService } from '../../auth/services/merchant/customer.merchant.service';
// import { RequestExport } from '../../export/entities/request-export.entity';
// import {
//   RequestExportStatus,
//   RequestExportType,
// } from '../../export/enums/request-export.enum';
// import { RequestExportRepository } from '../../export/repositories/request-export.repositories';
// import { File } from '../../file/entities/file.entity';
// // import { ExportListGameWinHistoryMerchantReqDto } from '../../game/dtos/merchant/req/game-win-history.merchant.req.dto';
// // import { GameWinHistoryMerchantService } from '../../game/services/merchant/game-win-history-merchant.service';
// // import { ExportListLoyaltyCodeMerchantReqDto } from '../../loyalty-code/dtos/merchant/req/loyalty-code.merchant.req.dto';
// // import { LoyaltyCodeMerchantService } from '../../loyalty-code/services/merchant/loyalty-code.merchant.service';
// // import {
// //   ExportListOrdersMerchantReqDto,
// //   ExportOrderRefund,
// // } from '../../order/dtos/merchant/req/order.merchant.req.dto';
// // import { OrderMerchantService } from '../../order/services/merchant/order.merchant.service';
// // import { ExportListExternalReferrerMerchantReqDto } from '../../referral/dtos/merchant/req/external-referrer.merchant.req.dto';
// // import { ExportListReferralHistoryMerchantReqDto } from '../../referral/dtos/merchant/req/referral-history.merchant.req.dto';
// // import { ExternalReferrerMerchantService } from '../../referral/services/merchant/external-referrer.merchant.service';
// // import { ReferralHistoryMerchantService } from '../../referral/services/merchant/referral-history.merchant.service';
// import { GetLineChartStatisticGameMerchantReqDto } from '../../statistic/dtos/merchant/req/statistic-game.merchant.req.dto';
// import { GetLineChartStatisticOrderMerchantReqDto } from '../../statistic/dtos/merchant/req/statistic-order.merchant.req.dto';
// import { GetLineChartStatisticPointMerchantReqDto } from '../../statistic/dtos/merchant/req/statistic-point.merchant.req.dto';
// import { RequestExportStatisticScanMerchantReqDto } from '../../statistic/dtos/merchant/req/statistic-scan.merchant.req.dto';
// import { StatisticGameMerchantService } from '../../statistic/services/merchant/statistic-game.merchant.service';
// import { StatisticOrderMerchantService } from '../../statistic/services/merchant/statistic-order.merchant.service';
// import { StatisticPointMerchantService } from '../../statistic/services/merchant/statistic-point.merchant.service';
// import { StatisticScanMerchantService } from '../../statistic/services/merchant/statistic-scan.merchant.service';
// // import { ExportListStoreMerchantReqDto } from '../../store/dtos/merchant/req/store.merchant.req.dto';
// // import { StoreMerchantService } from '../../store/services/merchant/store.merchant.service';
// // import { GetDetailUserSurveyAnswerMerchantReqDto } from '../../survey/dtos/merchant/req/survey.merchant.req.dto';
// // import { SurveyMerchantService } from '../../survey/services/merchant/survey.merchant.service';
// // import { ExportFeedbackMerchantDto } from '../../user-feedback/dtos/req/feedback-answer.dto';
// // import { UserFeedbackMerchantService } from '../../user-feedback/services/merchant/user-feedback.merchant.service';
// import { ExportJobDataDto } from '../dto/export-job-data.dto';
// import { QueueName } from '../enums/worker.enum';

// @Processor(QueueName.EXPORT)
// export class ExportProcessor {
//   private logger = new Logger(ExportProcessor.name);
//   constructor(
//     // private customerMerchantService: CustomerMerchantService,
//     private requestExportRepo: RequestExportRepository,
//     // private surveyMerchantService: SurveyMerchantService,
//     // private orderMerchantService: OrderMerchantService,
//     // private storeMerchantService: StoreMerchantService,
//     // private userFeedbackMerchantService: UserFeedbackMerchantService,
//     private statisticOrderMerchantService: StatisticOrderMerchantService,
//     private statisticScanMerchantService: StatisticScanMerchantService,
//     private statisticPointMerchantService: StatisticPointMerchantService,
//     private statisticGameMerchantService: StatisticGameMerchantService,
//     // private gameWinHistoryMerchantService: GameWinHistoryMerchantService,
//     // private externalReferrerMerchantService: ExternalReferrerMerchantService,
//     // private referralHistoryMerchantService: ReferralHistoryMerchantService,
//     // private loyaltyCodeMerchantService: LoyaltyCodeMerchantService,
//   ) {}

//   @OnQueueFailed()
//   async onFailed(job: Job<ExportJobDataDto>) {
//     const { requestExportId } = job.data;
//     this.logger.error(`export_job id=${requestExportId} failed`);
//     if (job.attemptsMade >= job.opts.attempts) {
//       await this.requestExportRepo.update(requestExportId, {
//         status: RequestExportStatus.FAILED,
//       });
//     }
//   }

//   @OnQueueActive()
//   async onActive(job: Job<ExportJobDataDto>) {
//     const { requestExportId } = job.data;
//     this.logger.log(`export_job id=${requestExportId} active`);
//     await this.requestExportRepo.update(requestExportId, {
//       status: RequestExportStatus.PROCESSING,
//     });
//   }

//   // @Process({ concurrency: 3 })
//   // async process(job: Job<ExportJobDataDto>) {
//   //   const { requestExportId } = job.data;
//   //   let file: File;
//   //   const requestExport = await this.requestExportRepo.findOne({
//   //     where: { id: requestExportId },
//   //     relations: { owner: { merchant: true } },
//   //   });

//   //   if (!requestExport) {
//   //     this.logger.error(
//   //       `Request export not found. JobId=${job.id}, requestExportId=${requestExportId}`,
//   //     );
//   //     return;
//   //   }

//   //   try {
//   //     switch (requestExport.type) {
//   //       case RequestExportType.STATISTIC_GAME_DETAIL:
//   //         file = await this.handleExportStatisticsGameDetail(requestExport);
//   //         break;
//   //       case RequestExportType.STATISTIC_ORDER_DETAIL:
//   //         file = await this.handleExportStatisticsOrderDetail(requestExport);
//   //         break;
//   //       case RequestExportType.STATISTIC_POINT_DETAIL:
//   //         file = await this.handleExportStatisticsPointDetail(requestExport);
//   //         break;
//   //       case RequestExportType.STATISTIC_SCAN_DETAIL:
//   //         file = await this.handleExportStatisticsScanDetail(requestExport);
//   //         break;
//   //       case RequestExportType.LIST_CUSTOMER:
//   //         file = await this.handleExportListCustomer(requestExport);
//   //         break;
//   //       case RequestExportType.LIST_CUSTOMER_JOIN_SURVEY:
//   //         file = await this.handleExportListCustomerJoinSurvey(requestExport);
//   //         break;
//   //       case RequestExportType.CUSTOMER_ANSWER_DETAIL:
//   //         file = await this.handleExportCustomerAnswerDetail(requestExport);
//   //         break;
//   //       case RequestExportType.LIST_STORE:
//   //         file = await this.handleExportListStore(requestExport);
//   //         break;
//   //       case RequestExportType.LIST_ORDER_REFUND:
//   //         file = await this.handleExportListOrderRefund(requestExport);
//   //         break;

//   //       case RequestExportType.LIST_ORDER_PHYSICAL_OR_E_VOUCHER:
//   //         file = await this.handleExportListOrderPhysicalOrEVoucher(
//   //           requestExport,
//   //         );
//   //         break;

//   //       case RequestExportType.LIST_FEEDBACK_ANSWER:
//   //         file = await this.handleExportListFeedbackAnswer(requestExport);
//   //         break;

//   //       case RequestExportType.LIST_GAME:
//   //         file = await this.handleExportListGame(requestExport);
//   //         break;

//   //       case RequestExportType.LIST_REFERRAL:
//   //         file = await this.handleExportListReferral(requestExport);
//   //         break;

//   //       case RequestExportType.REFERRAL_DETAIL:
//   //         file = await this.handleExportReferralDetail(requestExport);
//   //         break;

//   //       case RequestExportType.LIST_REFERRAL_USER:
//   //         file = await this.handleExportListReferralUser(requestExport);
//   //         break;

//   //       case RequestExportType.LIST_LOYALTY_CODE:
//   //         file = await this.handleExportListLoyaltyCode(requestExport);
//   //         break;

//   //       default:
//   //         throw new Error(
//   //           `Request export resource is invalid, requestExportId=${requestExportId}`,
//   //         );
//   //     }
//   //     await this.requestExportRepo.update(requestExportId, {
//   //       fileId: file.id,
//   //       status: RequestExportStatus.COMPLETED,
//   //     });
//   //   } catch (error) {
//   //     this.logger.error('Error handle export');
//   //     await this.requestExportRepo.update(requestExportId, {
//   //       fileId: file.id,
//   //       error: serializeError(error),
//   //     });

//   //     throw error;
//   //   }
//   // }

//   // private async handleExportStatisticsGameDetail(requestExport: RequestExport) {
//   //   const file = await this.statisticGameMerchantService.handleExport({
//   //     params: requestExport.params as GetLineChartStatisticGameMerchantReqDto,
//   //     owner: requestExport.owner,
//   //     fileName: requestExport.fileName,
//   //   });

//   //   return file;
//   // }

//   // private async handleExportStatisticsOrderDetail(
//   //   requestExport: RequestExport,
//   // ) {
//   //   const file = await this.statisticOrderMerchantService.handleExport({
//   //     params: requestExport.params as GetLineChartStatisticOrderMerchantReqDto,
//   //     owner: requestExport.owner,
//   //     fileName: requestExport.fileName,
//   //   });

//   //   return file;
//   // }

//   // private async handleExportStatisticsPointDetail(
//   //   requestExport: RequestExport,
//   // ) {
//   //   const file = await this.statisticPointMerchantService.handleExport({
//   //     params: requestExport.params as GetLineChartStatisticPointMerchantReqDto,
//   //     owner: requestExport.owner,
//   //     fileName: requestExport.fileName,
//   //   });

//   //   return file;
//   // }

//   // private async handleExportStatisticsScanDetail(requestExport: RequestExport) {
//   //   const file = await this.statisticScanMerchantService.handleExport({
//   //     params: requestExport.params as RequestExportStatisticScanMerchantReqDto,
//   //     owner: requestExport.owner,
//   //     fileName: requestExport.fileName,
//   //   });

//   //   return file;
//   // }

//   private async handleExportListCustomer(requestExport: RequestExport) {
//     switch (requestExport.userType) {
//       case UserType.MERCHANT:
//         const file = await this.customerMerchantService.handleExport({
//           params: requestExport.params as ExportListCustomerMerchantReqDto,
//           owner: requestExport.owner,
//           fileName: requestExport.fileName,
//         });

//         return file;

//       case UserType.ADMIN:
//       case UserType.CUSTOMER:
//         throw new Error(
//           `Request export type admin or customer is not implemented, requestExportId=${requestExport.id}`,
//         );
//       default:
//         throw new Error(
//           `Request export type is invalid, requestExportId=${requestExport.id}`,
//         );
//     }
//   }

//   private async handleExportListCustomerJoinSurvey(
//     requestExport: RequestExport,
//   ) {
//     switch (requestExport.userType) {
//       case UserType.MERCHANT:
//         const file =
//           await this.surveyMerchantService.handleExportUserJoinSurvey({
//             params:
//               requestExport.params as GetDetailUserSurveyAnswerMerchantReqDto,
//             owner: requestExport.owner,
//             fileName: requestExport.fileName,
//           });

//         return file;

//       case UserType.ADMIN:
//       case UserType.CUSTOMER:
//         throw new Error(
//           `Request export type admin or customer is not implemented, requestExportId=${requestExport.id}`,
//         );
//       default:
//         throw new Error(
//           `Request export type is invalid, requestExportId=${requestExport.id}`,
//         );
//     }
//   }

//   private async handleExportCustomerAnswerDetail(requestExport: RequestExport) {
//     switch (requestExport.userType) {
//       case UserType.MERCHANT:
//         const file =
//           await this.surveyMerchantService.handleExportUserSurveyAnswer({
//             params:
//               requestExport.params as GetDetailUserSurveyAnswerMerchantReqDto,
//             owner: requestExport.owner,
//             fileName: requestExport.fileName,
//           });

//         return file;

//       case UserType.ADMIN:
//       case UserType.CUSTOMER:
//         throw new Error(
//           `Request export type admin or customer is not implemented, requestExportId=${requestExport.id}`,
//         );
//       default:
//         throw new Error(
//           `Request export type is invalid, requestExportId=${requestExport.id}`,
//         );
//     }
//   }

//   private async handleExportListStore(requestExport: RequestExport) {
//     switch (requestExport.userType) {
//       case UserType.MERCHANT:
//         const file = await this.storeMerchantService.handleExport({
//           params: requestExport.params as ExportListStoreMerchantReqDto,
//           owner: requestExport.owner,
//           fileName: requestExport.fileName,
//         });

//         return file;

//       case UserType.ADMIN:
//       case UserType.CUSTOMER:
//         throw new Error(
//           `Request export type admin or customer is not implemented, requestExportId=${requestExport.id}`,
//         );
//       default:
//         throw new Error(
//           `Request export type is invalid, requestExportId=${requestExport.id}`,
//         );
//     }
//   }

//   private async handleExportListOrderRefund(requestExport: RequestExport) {
//     switch (requestExport.userType) {
//       case UserType.MERCHANT:
//         const file = await this.orderMerchantService.exportRefundOrder({
//           params: requestExport.params as ExportOrderRefund,
//           owner: requestExport.owner,
//           fileName: requestExport.fileName,
//         });

//         return file;

//       case UserType.ADMIN:
//       case UserType.CUSTOMER:
//         throw new Error(
//           `Request export type admin or customer is not implemented, requestExportId=${requestExport.id}`,
//         );
//       default:
//         throw new Error(
//           `Request export type is invalid, requestExportId=${requestExport.id}`,
//         );
//     }
//   }

//   private async handleExportListOrderPhysicalOrEVoucher(
//     requestExport: RequestExport,
//   ) {
//     switch (requestExport.userType) {
//       case UserType.MERCHANT:
//         const file = await this.orderMerchantService.handleExportListOrder({
//           params: requestExport.params as ExportListOrdersMerchantReqDto,
//           owner: requestExport.owner,
//           fileName: requestExport.fileName,
//         });

//         return file;

//       case UserType.ADMIN:
//       case UserType.CUSTOMER:
//         throw new Error(
//           `Request export type admin or customer is not implemented, requestExportId=${requestExport.id}`,
//         );
//       default:
//         throw new Error(
//           `Request export type is invalid, requestExportId=${requestExport.id}`,
//         );
//     }
//   }

//   private async handleExportListFeedbackAnswer(requestExport: RequestExport) {
//     switch (requestExport.userType) {
//       case UserType.MERCHANT:
//         const file = await this.userFeedbackMerchantService.exportFeedbackUser({
//           params: requestExport.params as ExportFeedbackMerchantDto,
//           owner: requestExport.owner,
//           fileName: requestExport.fileName,
//         });

//         return file;

//       case UserType.ADMIN:
//       case UserType.CUSTOMER:
//         throw new Error(
//           `Request export type admin or customer is not implemented, requestExportId=${requestExport.id}`,
//         );
//       default:
//         throw new Error(
//           `Request export type is invalid, requestExportId=${requestExport.id}`,
//         );
//     }
//   }

//   private async handleExportListGame(requestExport: RequestExport) {
//     switch (requestExport.userType) {
//       case UserType.MERCHANT:
//         const file = await this.gameWinHistoryMerchantService.handleExport({
//           params:
//             requestExport.params as ExportListGameWinHistoryMerchantReqDto,
//           owner: requestExport.owner,
//           fileName: requestExport.fileName,
//         });

//         return file;

//       case UserType.ADMIN:
//       case UserType.CUSTOMER:
//         throw new Error(
//           `Request export type admin or customer is not implemented, requestExportId=${requestExport.id}`,
//         );
//       default:
//         throw new Error(
//           `Request export type is invalid, requestExportId=${requestExport.id}`,
//         );
//     }
//   }

//   private async handleExportListReferral(requestExport: RequestExport) {
//     switch (requestExport.userType) {
//       case UserType.MERCHANT:
//         const file =
//           await this.externalReferrerMerchantService.handleExportListStore({
//             params:
//               requestExport.params as ExportListExternalReferrerMerchantReqDto,
//             owner: requestExport.owner,
//             fileName: requestExport.fileName,
//           });

//         return file;

//       case UserType.ADMIN:
//       case UserType.CUSTOMER:
//         throw new Error(
//           `Request export type admin or customer is not implemented, requestExportId=${requestExport.id}`,
//         );
//       default:
//         throw new Error(
//           `Request export type is invalid, requestExportId=${requestExport.id}`,
//         );
//     }
//   }

//   private async handleExportReferralDetail(requestExport: RequestExport) {
//     switch (requestExport.userType) {
//       case UserType.MERCHANT:
//         const file =
//           await this.externalReferrerMerchantService.handleExportDetailStore({
//             params: requestExport.params as number,
//             owner: requestExport.owner,
//             fileName: requestExport.fileName,
//           });

//         return file;

//       case UserType.ADMIN:
//       case UserType.CUSTOMER:
//         throw new Error(
//           `Request export type admin or customer is not implemented, requestExportId=${requestExport.id}`,
//         );
//       default:
//         throw new Error(
//           `Request export type is invalid, requestExportId=${requestExport.id}`,
//         );
//     }
//   }

//   private async handleExportListReferralUser(requestExport: RequestExport) {
//     switch (requestExport.userType) {
//       case UserType.MERCHANT:
//         const file = await this.referralHistoryMerchantService.handleExport({
//           params:
//             requestExport.params as ExportListReferralHistoryMerchantReqDto,
//           owner: requestExport.owner,
//           fileName: requestExport.fileName,
//         });

//         return file;

//       case UserType.ADMIN:
//       case UserType.CUSTOMER:
//         throw new Error(
//           `Request export type admin or customer is not implemented, requestExportId=${requestExport.id}`,
//         );
//       default:
//         throw new Error(
//           `Request export type is invalid, requestExportId=${requestExport.id}`,
//         );
//     }
//   }

//   private async handleExportListLoyaltyCode(requestExport: RequestExport) {
//     switch (requestExport.userType) {
//       case UserType.MERCHANT:
//         const file = await this.loyaltyCodeMerchantService.handleExport({
//           params: requestExport.params as ExportListLoyaltyCodeMerchantReqDto,
//           owner: requestExport.owner,
//           fileName: requestExport.fileName,
//         });

//         return file;

//       case UserType.ADMIN:
//       case UserType.CUSTOMER:
//         throw new Error(
//           `Request export type admin or customer is not implemented, requestExportId=${requestExport.id}`,
//         );
//       default:
//         throw new Error(
//           `Request export type is invalid, requestExportId=${requestExport.id}`,
//         );
//     }
//   }
// }
