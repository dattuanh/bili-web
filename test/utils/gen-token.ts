import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { JwtAuthPayload } from '../../src/auth/interfaces/jwt-payload.interface';
dotenv.config();

export interface GenTokenParams {
  userId: number;
  expiresIn?: string;
}

export const genTokenMerchant = ({
  userId,
  expiresIn = '3d',
}: GenTokenParams) => {
  const payload: JwtAuthPayload = { userId };
  const privateKey = process.env.AUTH_JWT_ACCESS_TOKEN_KEY;

  return jwt.sign(payload, privateKey, { expiresIn });
};

export const genTokenCustomer = ({
  userId,
  expiresIn = '3d',
}: GenTokenParams) => {
  const payload: JwtAuthPayload = { userId };
  const privateKey = process.env.AUTH_JWT_ACCESS_TOKEN_KEY;

  return jwt.sign(payload, privateKey, { expiresIn });
};
