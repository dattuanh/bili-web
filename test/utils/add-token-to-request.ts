import { Test } from 'supertest';
import { genTokenMerchant } from './gen-token';

export const attachToken = (request: Test, token: string) => {
  return request.set('Authorization', `Bearer ${token}`);
};

export const getRequestWithToken = (request: Test, userId: number) => {
  const token = genTokenMerchant({ userId });
  return attachToken(request, token);
};
