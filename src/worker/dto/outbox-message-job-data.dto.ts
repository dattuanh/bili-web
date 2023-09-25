import { NonFunctionProperties } from '../../common/types/utils.type';

export class OutboxMessageJobDataDto {
  outboxMessageId: number;

  constructor(data: NonFunctionProperties<OutboxMessageJobDataDto>) {
    Object.assign(this, data);
  }
}
