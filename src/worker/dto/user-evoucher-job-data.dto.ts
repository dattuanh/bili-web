import { NonFunctionProperties } from '../../common/types/utils.type';

export class UserEvoucherJobDataDto {
  userEvoucherId: number;

  constructor(data: NonFunctionProperties<UserEvoucherJobDataDto>) {
    Object.assign(this, data);
  }
}
