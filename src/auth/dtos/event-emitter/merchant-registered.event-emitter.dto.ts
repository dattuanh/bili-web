import { NonFunctionProperties } from '../../../common/types/utils.type';
//import { Merchant } from '../../entities/merchant.entity';
import { User } from '../../entities/user.entity';

export class MerchantRegisteredEventEmitterDto {
  user: User;
  //merchant: Merchant;

  constructor(data: NonFunctionProperties<MerchantRegisteredEventEmitterDto>) {
    Object.assign(this, data);
  }
}
