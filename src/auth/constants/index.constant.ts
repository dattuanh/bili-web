export enum StrategyName {
  ADMIN = 'jwt-authen-admin',
  EXTERNAL = 'EXTERNAL',
}

export const CHECK_PASSWORD_CONFIG = {
  MAX_RETRY_TIME: 5,
  BLOCK_EXP: 3600, //seconds = 1h
};

export const LOGIN_CONFIG = {
  MAX_RETRY_TIME: 5,
  BLOCK_EXP: 3600, //seconds = 1h
};
