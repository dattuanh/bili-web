import dotenv from 'dotenv';
dotenv.config();

export const QueueName = {
  EXPORT: `EXPORT:${process.env.NODE_ENV}`,
  IMPORT: `IMPORT:${process.env.NODE_ENV}`,
  OUTBOX_MESSAGE: `OUTBOX_MESSAGE:${process.env.NODE_ENV}`,
  NOTI_JOB: `NOTI_JOB:${process.env.NODE_ENV}`,
  NOTI_JOB_BATCH: `NOTI_JOB_BATCH:${process.env.NODE_ENV}`,
  UPDATE_LOYALTY_CODE_GROUP: `UPDATE_LOYALTY_CODE_GROUP:${process.env.NODE_ENV}`,
  CREATE_LOYALTY_CODE_JOB: `CREATE_LOYALTY_CODE_JOB:${process.env.NODE_ENV}`,
  USER_EVOUCHER: `USER_EVOUCHER:${process.env.NODE_ENV}`,
  GAME_PLAY_TIME_EXPIRY: `GAME_PLAY_TIME_EXPIRY:${process.env.NODE_ENV}`,
};
