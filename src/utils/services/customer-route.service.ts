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

  profile() {
    return `/profile`;
  }

  notify() {
    return `/notify`;
  }

  address() {
    return `/address`;
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

  term() {
    return `/term`;
  }

  help() {
    return `/help`;
  }
}
