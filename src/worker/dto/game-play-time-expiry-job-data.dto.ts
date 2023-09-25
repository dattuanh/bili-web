import { NonFunctionProperties } from '../../common/types/utils.type';

export class GamePlayTimeExpiryJobDataDto {
  userId: number;
  gameTypeId: number;

  constructor(data: NonFunctionProperties<GamePlayTimeExpiryJobDataDto>) {
    Object.assign(this, data);
  }
}
