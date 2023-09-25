import { Injectable } from '@nestjs/common';
// import { MerchantRepository } from '../../auth/repositories/merchant.repository';
import { PRODUCTION_SANDBOX_EMAILS } from '../../common/constants/global.constant';
// import { RedeemProductUrBoxResDto } from '../../external/dtos/ur-box/res/redeem-product.ur-box.res.dto';
// import { MockRedeemUrBoxResponse } from '../data/sandbox.data';

@Injectable()
export class SandboxService {
  // constructor(private merchantRepo: MerchantRepository) {}

  // async checkAndMockRedeemUrBox(
  //   merchantUserId: number,
  // ): Promise<RedeemProductUrBoxResDto | void> {
  //   try {
  //     const merchant = await this.merchantRepo.findOneBy({
  //       userId: merchantUserId,
  //     });
  //     if (!PRODUCTION_SANDBOX_EMAILS.includes(merchant.email)) return;

  //     return MockRedeemUrBoxResponse;
  //   } catch (error) {
  //     console.log('error in checkAndMockRedeemUrBox', error);
  //     return;
  //   }
  // }
}
