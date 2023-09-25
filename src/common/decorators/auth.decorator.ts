import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { AuthenExternalGuard } from '../../auth/guards/authen.external.guard';
import { JwtAuthenAdminGuard } from '../../auth/guards/jwt-authen.admin.guard';
import { ABILITY_METADATA_KEY } from '../constants/global.constant';
import { BadRequestExc } from '../exceptions/custom.exception';
import { RequiredRule } from '../interfaces/casl.interface';

export const IS_PUBLIC_KEY = Symbol();
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const AuthenticateAdmin = () =>
  applyDecorators(UseGuards(JwtAuthenAdminGuard), ApiBearerAuth());

export const AuthenticateExternal = () =>
  applyDecorators(UseGuards(AuthenExternalGuard), ApiBearerAuth());

// export const AuthorizeAdmin = (...requirements: RequiredRule[]) => {
//   return applyDecorators(
//     UseGuards(JwtAbilityAdminGuard),
//     SetMetadata(ABILITY_METADATA_KEY, requirements),
//     ApiBearerAuth(),
//   );
// };

export const CurrentAuthData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export function AppCodeHeader() {
  return applyDecorators(ApiHeader({ name: 'app_code' }));
}

// Use snake case because header get automatically convert to lowercase
export const AppCode = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    if (!request.headers?.app_code)
      throw new BadRequestExc({ message: 'common.validationError.appCode' });

    return request.headers.app_code;
  },
);
