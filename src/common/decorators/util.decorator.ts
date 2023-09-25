import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getClientIp } from '@supercharge/request-ip';
import { FastifyRequest } from 'fastify';

export const IpAddress = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as FastifyRequest;
  return getClientIp(request);
});
