import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Propagation, Transactional } from 'typeorm-transactional';
// import { UserTransactionLockType } from '../enums/user-transaction-lock.enum';
// import { UserTransactionLockRepository } from '../repositories/user-transaction-lock.repository';

@Injectable()
export class UtilService {
  constructor(
    private moduleRef: ModuleRef,
    // private userTransactionLockRepo: UserTransactionLockRepository,
  ) {}

  async getService<T>(serviceClass: Type<T>) {
    let service = this.moduleRef.get(serviceClass, { strict: false });
    if (!service) service = await this.moduleRef.create(serviceClass);

    return service;
  }

  // @Transactional({ propagation: Propagation.MANDATORY })
  // async lockConcurrency(userId: number, type: UserTransactionLockType) {
  //   await this.userTransactionLockRepo.findOneOrThrowNotFoundExc({
  //     where: { userId, type },
  //     lock: { mode: 'pessimistic_write' },
  //   });
  // }
}
