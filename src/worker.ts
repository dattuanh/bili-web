import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { WorkerModule } from './worker/worker.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    WorkerModule,
    new FastifyAdapter(),
  );

  app.enableVersioning({ type: VersioningType.URI });
  await app.listen(+process.env.WORKER_PORT || 5001, '0.0.0.0');
  console.log('worker is listening at ', await app.getUrl());
}
bootstrap();
