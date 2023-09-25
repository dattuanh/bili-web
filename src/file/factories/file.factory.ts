import { faker } from '@faker-js/faker';
import {
  EagerInstanceAttribute,
  Factory,
  SingleSubfactory,
} from '@jorgebodega/typeorm-factory';
import {
  Constructable,
  FactorizedAttrs,
} from '@jorgebodega/typeorm-factory/dist/types';
import { DataSource } from 'typeorm';
import { dataSource } from '../../../data-source';
import { UserType } from '../../auth/enums/user.enum';
// import { MerchantFactory } from '../../auth/factories/merchant.factory';
import { UserFactory } from '../../auth/factories/user.factory';
import { SupportFileType } from '../../common/enums/file.enum';
import { File } from '../entities/file.entity';

// export class FileFactory extends Factory<File> {
//   protected entity: Constructable<File> = File;
//   protected dataSource: DataSource = dataSource;
//   protected attrs(): FactorizedAttrs<File> {
//     return {
//       key: faker.system.directoryPath(),
//       type: SupportFileType.png,
//       uploader: new EagerInstanceAttribute(
//         () =>
//           new SingleSubfactory(UserFactory, {
//             type: UserType.MERCHANT,
//             merchant: new EagerInstanceAttribute(
//               (instance) => new SingleSubfactory(MerchantFactory),
//             ),
//           }),
//       ),
//     };
//   }
// }

// export const fileFactory = new FileFactory();
