import { JwtPayload } from 'jsonwebtoken';

export interface JwtAuthPayload extends JwtPayload {
  userId: number;
}

export interface VerificationMerchantPayload extends JwtPayload {
  token: string;
  merchantId: number;
}
