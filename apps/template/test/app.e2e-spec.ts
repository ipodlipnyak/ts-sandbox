import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { dataSource } from './../src/config/db.config';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    // await dataSource.destroy();
  });

  it('/ (GET)', async () => {
    return await request(app.getHttpServer()).get('/').expect(200);
    // .expect({"data":"Hello World!"});
  });
});
