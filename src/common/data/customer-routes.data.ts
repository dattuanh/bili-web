export const CUSTOMER_ROUTE = {
  LIST_PHYSICAL_ORDER: '/dashboard/order_management/list-physical',
  LIST_EVOUCHER_ORDER: '/dashboard/order_management/list-voucher',
  LIST_ORDER_REFUND_REQUEST: '/dashboard/order_management/list-refund-coin',
  LIST_ORDER_REFUND_COMPLETE: '/dashboard/order_management/list-refund-request',
  DETAIL_ORDER: (id: number | string) =>
    `/dashboard/order_management/detail/${id}`,
} as const;
