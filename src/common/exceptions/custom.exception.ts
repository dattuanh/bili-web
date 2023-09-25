import { I18nPath } from '../../i18n/i18n.generated';
import { ExceptionSubCode } from '../constants/exception.constant';
import { NonFunctionProperties } from '../types/utils.type';

export type CustomExceptionMessage = I18nPath | I18nPath[];

export class CustomException {
  status: number;
  message: CustomExceptionMessage;
  params?: object;
  subCode?: ExceptionSubCode;

  constructor({
    message,
    status,
    params,
    subCode,
  }: NonFunctionProperties<CustomException>) {
    this.status = status;
    this.message = message;
    this.params = params;
    this.subCode = subCode;
  }
}

export class ForbiddenExc extends CustomException {
  constructor(params: NonFunctionProperties<Omit<CustomException, 'status'>>) {
    super({ ...params, status: 403 });
  }
}

export class NotFoundExc extends CustomException {
  constructor(params: NonFunctionProperties<Omit<CustomException, 'status'>>) {
    super({ ...params, status: 404 });
  }
}

export class AddPointBaseExc extends CustomException {
  constructor(params: NonFunctionProperties<Omit<CustomException, 'status'>>) {
    super({ ...params, status: 400 });
  }
}

export class UnauthorizedExc extends CustomException {
  constructor(params: NonFunctionProperties<Omit<CustomException, 'status'>>) {
    super({ ...params, status: 401 });
  }
}

export class ConflictExc extends CustomException {
  constructor(params: NonFunctionProperties<Omit<CustomException, 'status'>>) {
    super({ ...params, status: 409 });
  }
}

export class BadRequestExc extends CustomException {
  constructor(params: NonFunctionProperties<Omit<CustomException, 'status'>>) {
    super({ ...params, status: 400 });
  }
}

export class InternalServerErrorExc extends CustomException {
  constructor(params: NonFunctionProperties<Omit<CustomException, 'status'>>) {
    super({ ...params, status: 500 });
  }
}

export class ExpectationFailedExc extends CustomException {
  constructor(params: NonFunctionProperties<Omit<CustomException, 'status'>>) {
    super({ ...params, status: 417 });
  }
}

export class ServiceUnavailableExc extends CustomException {
  constructor(params: NonFunctionProperties<Omit<CustomException, 'status'>>) {
    super({ ...params, status: 503 });
  }
}
