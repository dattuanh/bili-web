export interface ErrorResponse {
  statusCode?: number;
  timestamp?: string;
  path?: string;
  debugInfo?: any;
  message?: string;
  errMsg?: string;
  error?: string;
  subCode?: number;
}
