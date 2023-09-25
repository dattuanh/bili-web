export interface CheckPasswordRedisData {
  retryTime: number;
  blockExp: null | Date; // null | ISO 8601 string
}
