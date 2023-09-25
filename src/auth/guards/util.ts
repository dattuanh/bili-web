import { ExecutionContext } from '@nestjs/common';
import { IAuthGuard } from '@nestjs/passport';
import { ExceptionSubCode } from '../../common/constants/exception.constant';
import {
  CustomException,
  UnauthorizedExc,
} from '../../common/exceptions/custom.exception';

export const handleRequest: IAuthGuard['handleRequest'] = (
  err: any,
  user: any,
  info: any,
  context: ExecutionContext,
  status?: any,
) => {
  if (err instanceof CustomException) throw err;

  if (err || !user) {
    throw new UnauthorizedExc({
      message: 'auth.common.invalidToken',
      subCode: ExceptionSubCode.INVALID_ACCESS_TOKEN,
    });
  }
  return user;
};
