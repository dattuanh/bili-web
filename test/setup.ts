/* eslint-disable */
import { INestApplication } from '@nestjs/common/interfaces';
import { Test } from '@nestjs/testing';
import { Redis } from 'ioredis';
import RedisMock from 'ioredis-mock';
import { dataSource } from '../data-source';
import { AppModule } from '../src/app/app.module';

// Declare any global var in here to avoid conflict
declare global {
  var app: INestApplication;
  var redisMock: Redis;
}

beforeAll(async () => {
  global.redisMock = new RedisMock();
  jest.mock('ioredis', () => redisMock);

  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
    controllers: [],
    providers: [],
  }).compile();

  global.app = moduleFixture.createNestApplication();
  await global.app.init();
});

beforeEach(async () => {
  // clear db before each test
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  await dataSource.query('DROP schema IF EXISTS public cascade');
  await dataSource.query('Create schema public');
  await dataSource.runMigrations();
});

afterAll(async () => {
  await global.app.close();
  if (dataSource.isInitialized) await dataSource.destroy();
});
