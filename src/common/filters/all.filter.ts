import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { HttpAdapterHost } from '@nestjs/core';
import { I18nContext } from 'nestjs-i18n';
import { serializeError } from 'serialize-error';
import { I18nTranslations } from '../../i18n/i18n.generated';
import { AppEnvironment } from '../enums/app.enum';
import { CustomException } from '../exceptions/custom.exception';
import { ErrorResponse } from '../interfaces/error-res.interface';
import { tryParseJson } from '../utils';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.

    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const i18n = I18nContext.current<I18nTranslations>(host);
    const path = httpAdapter.getRequestUrl(ctx.getRequest());

    this.logException(exception, path);

    let status: number;
    let message: string;
    const subCode: number = exception.subCode;

    if (exception instanceof CustomException) {
      status = exception.status;

      if (Array.isArray(exception.message)) {
        message = exception.message
          .map((item) => i18n.t(item, { args: exception.params }))
          .join(' ');
      } else {
        message = i18n.t(
          exception.message || 'common.exc.internalServerError',
          { args: exception.params },
        );
      }
    } else if (exception instanceof BadRequestException) {
      const response = exception.getResponse() as any;

      if (response?.message?.length) {
        status = HttpStatus.BAD_REQUEST;
        const jsonMsg = tryParseJson(response.message[0]);

        if (Array.isArray(jsonMsg)) {
          message = jsonMsg.map((item) => i18n.t(item)).join(' ');
        } else {
          message = i18n.t(
            response?.message?.length ? jsonMsg : 'common.exc.badRequest',
          );
        }
      } else {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = i18n.t('common.exc.internalServerError');
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = i18n.t('common.exc.internalServerError');
    }

    const responseBody: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path,
      subCode,
      message: String(message),
    };

    if (process.env.NODE_ENV !== AppEnvironment.PRODUCTION) {
      responseBody.debugInfo = serializeError(exception);
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }

  private logException(exception: any, path: string) {
    if (exception instanceof NotFoundException) return;
    if (exception instanceof BadRequestException) return;

    if (process.env.NODE_ENV !== AppEnvironment.TEST) {
      console.log(`exception at ${path}: `, exception);
    }
  }
}
