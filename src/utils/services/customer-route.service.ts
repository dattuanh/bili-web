import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerRouteService {
  constructor() {}

  home() {
    return '/';
  }

  login() {
    return `/login`;
  }

  register() {
    return `/register`;
  }

  forgotPassword() {
    return `/forgot-password`;
  }

  otp() {
    return `/otp`;
  }

  resetPassword() {
    return `/reset-password`;
  }

  createInformation() {
    return `/create-information`;
  }

  addPoint() {
    return `/loyalty/add-point`;
  }

  addPointSuccess() {
    return `/loyalty/add-point/success`;
  }

  productList() {
    return `/category`;
  }

  productDetail(id: number) {
    return `/productDetail/${id}`;
  }

  orderHistoryList() {
    return `/order-history`;
  }

  orderHistoryDetail(id: number) {
    return `/order-history/${id}`;
  }

  checkout() {
    return `/checkout`;
  }

  profile() {
    return `/profile`;
  }

  notify() {
    return `/notify`;
  }

  historyPoint() {
    return `/history-point`;
  }

  address() {
    return `/address`;
  }

  evoucherList() {
    return `/e-voucher`;
  }

  evoucherDetail(id: number) {
    return `/e-voucher/${id}`;
  }

  gameList() {
    return `/game/lucky-wheel`;
  }

  gameDetail(id: number) {
    return `/game/lucky-wheel/${id}`;
  }

  newsList() {
    return `/news`;
  }

  newsDetail(id: number) {
    return `/news-detail/${id}`;
  }

  subjectList() {
    return `/subject`;
  }

  policy() {
    return `/policy`;
  }

  term() {
    return `/term`;
  }

  help() {
    return `/help`;
  }
}
