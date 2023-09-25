import { NonFunctionProperties } from '../../common/types/utils.type';

export class NotiJobBatchJobDataDto {
  notiJobBatchId: number;
  version: number;
  appCode: string;

  constructor(data: NonFunctionProperties<NotiJobBatchJobDataDto>) {
    Object.assign(this, data);
  }
}
