import { Users } from './users.entity';
import { TransactionCodeEnum } from './../balance';
import * as sinon from 'sinon';

const TEST_CONNECTION = 'testConnection';
const BALANCE_SAMPLE = [
      {
        id: 1,
        value: 100,
        code: TransactionCodeEnum.INCOME,
      },
      {
        id: 1,
        value: -20,
        code: TransactionCodeEnum.INCOME,
      },
      {
        id: 1,
        value: -40,
        code: TransactionCodeEnum.PURCHASE,
      },
    ];
describe('users', () => {
  describe('balance', () => {
    let mockBalanceList: any[] = BALANCE_SAMPLE;
    class MockUser extends Users {
      balance: any[] = BALANCE_SAMPLE;
    }
    let mockUser: MockUser;

    beforeAll(() => {
      mockBalanceList = BALANCE_SAMPLE;
      mockUser = new MockUser();
    });

    it('calc score', async () => {
      const result = mockUser.calcScore();
      expect(result).toEqual(80);
    });

    it('calc total', async () => {
      const result = mockUser.calcTotal();
      expect(result).toEqual(40);
    });

    it('export', async () => {
      const findUser = sinon.stub(Users, 'find').resolves([mockUser]);
      const result = await Users.exportBalance();
      expect(result.map((el) => el.delta)).toContain(40);
      expect(findUser.calledOnce).toBeTruthy();
    });
  });
});
