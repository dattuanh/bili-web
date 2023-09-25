import { OnQueueActive, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { Transactional } from 'typeorm-transactional';
// import { CustomerRepository } from '../../auth/repositories/customer.repository';
// import { MerchantRepository } from '../../auth/repositories/merchant.repository';
// import { NOTIFY_PLAY_TIME_EXPIRE_IN_HOUR } from '../../game/constants/game.constant';
// import { GamePlayTimeRepository } from '../../game/repositories/game-play-time.repository';
// import { GameTypeRepository } from '../../game/repositories/game-type.repository';
// import { NotiListenerService } from '../../noti/services/listeners/noti.listener.service';
import { GamePlayTimeExpiryJobDataDto } from '../dto/game-play-time-expiry-job-data.dto';
import { QueueName } from '../enums/worker.enum';

@Processor(QueueName.GAME_PLAY_TIME_EXPIRY)
export class GamePlayTimeExpiryProcessor {
  private logger = new Logger(GamePlayTimeExpiryProcessor.name);
  constructor(
    // private notiListenerSer: NotiListenerService,

    // private gamePlayTimeRepo: GamePlayTimeRepository,
    // private customerRepo: CustomerRepository,
    // private gameTypeRepo: GameTypeRepository,
    // private merchantRepo: MerchantRepository,
  ) {}

  @OnQueueFailed()
  async onFailed(job: Job<GamePlayTimeExpiryJobDataDto>) {
    this.logger.error(
      `GamePlayTimeExpiryProcessor userId=${job.data.userId}, gameTypeId=${job.data.gameTypeId} failed`,
    );
  }

  @OnQueueActive()
  async onActive(job: Job<GamePlayTimeExpiryJobDataDto>) {
    this.logger.log(
      `GamePlayTimeExpiryProcessor userId=${job.data.userId}, gameTypeId=${job.data.gameTypeId} active`,
    );
  }

  // @Process()
  // async process(job: Job<GamePlayTimeExpiryJobDataDto>) {
  //   try {
  //     await this.handleExpireGamePlayTime(job.data);
  //   } catch (error) {
  //     console.log('GamePlayTimeExpiryProcessor error', error);
  //     throw error;
  //   }
  // }

  // @Transactional()
  // private async handleExpireGamePlayTime(dto: GamePlayTimeExpiryJobDataDto) {
  //   const { gameTypeId, userId } = dto;

  //   const aboutToExpirePlayTime =
  //     await this.gamePlayTimeRepo.getPlayTimeAboutToExpire({
  //       gameTypeId,
  //       userId,
  //       timeToCheck: new Date(),
  //       hourToExpire: NOTIFY_PLAY_TIME_EXPIRE_IN_HOUR,
  //     });
  //   if (aboutToExpirePlayTime <= 0) return;

  //   const [customer, gameType] = await Promise.all([
  //     this.customerRepo.findOneByOrThrowNotFoundExc({ userId }),
  //     this.gameTypeRepo.findOneByOrThrowNotFoundExc({ id: gameTypeId }),
  //   ]);
  //   const rootMerchant = await this.merchantRepo.findOneByOrThrowNotFoundExc({
  //     id: customer.merchantUserId,
  //   });

  //   await this.notiListenerSer.pushNotiAboutToExpireGamePlayTime({
  //     customer,
  //     gameType,
  //     rootMerchant,
  //     aboutToExpirePlayTime,
  //   });
  // }
}
