import { Balance, Users } from './../src/models';
// import { dataSourceTest } from './../src/config/db.config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { dataSource } from './../src/config/db.config';

describe('Balance calculation', () => {
  let allUsers: Users[];
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    allUsers = await Users.find({ relations: ['balance'] });
  });

  afterAll(async () => {
    await app.close();
    // await process.exit();
    // await dataSource.destroy();
  });

  describe('calc total and score', () => {
    it('total calc should be matched by direct query', async () => {
      for (const index in allUsers) {
        const user = allUsers[index];
        const calculated = user.calcTotal();
        const fromDB = await Balance.queryUserTotal(user.id);
        expect(calculated).toBe(fromDB);
      }
    });

    it('score calc should be matched by direct query', async () => {
      for (const index in allUsers) {
        const user = allUsers[index];
        const calculated = user.calcScore();
        const fromDB = await Balance.queryUserScore(user.id);
        expect(calculated).toBe(fromDB);
      }
    });
  });
});
