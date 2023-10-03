import { User } from '../../auth/entities/user.entity';
import { NonFunctionProperties } from '../../common/types/utils.type';
// import { GetListGameWinHistoryMerchantReqDto } from '../../game/dtos/merchant/req/game-win-history.merchant.req.dto';
// import { ExportListLoyaltyCodeMerchantReqDto } from '../../loyalty-code/dtos/merchant/req/loyalty-code.merchant.req.dto';
// import {
//   ExportOrderRefund,
//   GetListOrdersMerchantReqDto,
// } from '../../order/dtos/merchant/req/order.merchant.req.dto';
// import { GetListExternalReferrerMerchantReqDto } from '../../referral/dtos/merchant/req/external-referrer.merchant.req.dto';
// import { GetListReferralHistoryMerchantReqDto } from '../../referral/dtos/merchant/req/referral-history.merchant.req.dto';
// import { GetLineChartStatisticGameMerchantReqDto } from '../../statistic/dtos/merchant/req/statistic-game.merchant.req.dto';
// import { GetLineChartStatisticOrderMerchantReqDto } from '../../statistic/dtos/merchant/req/statistic-order.merchant.req.dto';
// import {
//   GetDetailUserSurveyAnswerMerchantReqDto,
//   GetListUserJoinSurveyMerchantReqDto,
// } from '../../survey/dtos/merchant/req/survey.merchant.req.dto';
// import { GetFeedbackMerchantDto } from '../../user-feedback/dtos/req/feedback-answer.dto';

export class ExportJobDataDto<T = any> {
  requestExportId: number;

  constructor({ requestExportId }: NonFunctionProperties<ExportJobDataDto>) {
    this.requestExportId = requestExportId;
  }
}

export type IHandleExportDto = {
  params: // | GetListCustomerMerchantReqDto
  // | GetListUserJoinSurveyMerchantReqDto
  // | GetDetailUserSurveyAnswerMerchantReqDto
  // | ExportOrderRefund
  // | GetFeedbackMerchantDto
  // | GetListGameWinHistoryMerchantReqDto
  // | GetLineChartStatisticOrderMerchantReqDto
  // | GetListOrdersMerchantReqDto
  // | GetListExternalReferrerMerchantReqDto
  // | GetListReferralHistoryMerchantReqDto
  // | GetLineChartStatisticGameMerchantReqDto
  number;
  // | ExportListLoyaltyCodeMerchantReqDto;
  owner: User;
  fileName: string;
};
