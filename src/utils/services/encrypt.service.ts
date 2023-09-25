import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HASH_ROUND } from '../../common/constants/global.constant';

@Injectable()
export class EncryptService {
  encryptText(plain: string, hashRound: number = HASH_ROUND): string {
    return bcrypt.hashSync(plain, hashRound);
  }

  compareHash(plain: string, hash: string): boolean {
    return bcrypt.compareSync(plain, hash);
  }
}
