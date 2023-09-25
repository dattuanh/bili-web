import { ValueTransformer } from 'typeorm';
import { Propagation, runInTransaction } from 'typeorm-transactional';
import { isNullOrUndefined } from '../utils';

export class DecimalColumnTransformer implements ValueTransformer {
  to(data?: number | null): number | null {
    if (isNullOrUndefined(data)) return null;

    return data;
  }

  from(data?: string | null): number | null {
    if (isNullOrUndefined(data)) return null;

    const res = parseFloat(data);

    if (isNaN(res)) {
      return null;
    } else {
      return res;
    }
  }
}

/**
 *
 * @param callback
 * @returns use this function if you want save something to database which will not be rolled back if error happens
 */
export function runWithoutTransaction(callback: () => any) {
  return runInTransaction(callback, { propagation: Propagation.REQUIRES_NEW });
}
