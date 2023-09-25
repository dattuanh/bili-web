import { NonFunctionProperties } from '../../common/types/utils.type';

export class CreateLoyaltyCodeJobDataDto {
  loyaltyCodeGroupId: number;
  amount: number;

  constructor(data: NonFunctionProperties<CreateLoyaltyCodeJobDataDto>) {
    Object.assign(this, data);
  }
}

export class UpdateLoyaltyCodeGroupJobDataDto {
  loyaltyCodeGroupId: number;
  loyaltyCodeGroupVersion: number;

  constructor(data: NonFunctionProperties<UpdateLoyaltyCodeGroupJobDataDto>) {
    Object.assign(this, data);
  }
}
