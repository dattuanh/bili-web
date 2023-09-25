import 'firebase-admin/lib/messaging/messaging-api';

declare module 'firebase-admin/lib/messaging/messaging-api' {
  interface DataMessagePayload {
    appCode: string;
    [key: string]: string;
  }

  interface MessagingPayload {
    data: DataMessagePayload;
  }
}
