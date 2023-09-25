import { NonFunctionProperties } from '../../common/types/utils.type';

export class NotiJobDataDto {
  notiJobId: number;
  version: number;

  constructor(data: NonFunctionProperties<NotiJobDataDto>) {
    Object.assign(this, data);
  }
}
