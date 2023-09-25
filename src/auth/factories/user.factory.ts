import { Factory } from '@jorgebodega/typeorm-factory';
import {
  Constructable,
  FactorizedAttrs,
} from '@jorgebodega/typeorm-factory/dist/types';
import { DataSource } from 'typeorm';
import { dataSource } from '../../../data-source';
import { randomEnum } from '../../common/utils';
import { User } from '../entities/user.entity';
import { UserType } from '../enums/user.enum';

export class UserFactory extends Factory<User> {
  protected entity: Constructable<User> = User;
  protected dataSource: DataSource = dataSource;
  protected attrs(): FactorizedAttrs<User> {
    return {
      type: randomEnum(UserType),
    };
  }
}

export const userFactory = new UserFactory();
