import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  BaseEntity,
  // createQueryBuilder,
  In,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Balance, TransactionCodeEnum } from './../balance';
import { Purchase } from './../purchase';
import { BalanceImportDto, NewUserDto } from './../../dto';
import * as bcrypt from 'bcrypt';
import { Track } from './../track';
import { EventUser } from './../event';

export class UserExistError extends Error {
  name: 'USER_EXIST';
}
export const USER_EMAIL_EXIST_EXCEPTION = new UserExistError('User with this email already exist');

export class NewUserDataError extends Error {
  name: 'NEW_USER_DATA_ERROR';
}
export enum UserRole {
  USER = 100,
  ADMIN = 200,
}

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'integer',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  active: boolean;

  @Column({
    nullable: true,
  })
  firstName: string;

  @Column({
    nullable: true,
  })
  middleName: string;

  @Column({
    nullable: true,
  })
  lastName: string;

  @Column({
    nullable: true,
    unique: true,
  })
  email: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @OneToMany(() => Balance, (balance) => balance.user, { eager: true })
  balance: Balance[];

  @ManyToOne(() => Track, (track) => track.users, {
    onDelete: 'SET NULL',
    eager: false,
    nullable: true,
  })
  track: Track;

  @ManyToOne(() => EventUser, (event) => event.user, {
    onDelete: 'SET NULL',
    eager: false,
    nullable: true,
  })
  events: EventUser;


  /**
   * It is a hidden columns.
   * It will be Skipped on regular queries. Should be selected via addSelect.
   * @see https://typeorm.io/select-query-builder#hidden-columns
   */
  @Column({
    nullable: true,
    select: false,
  })
  password: string;

  /**
   * Behold! My stuff!
   * @see https://imgur.com/88RJmsr
   */
  @OneToMany(() => Purchase, (purchase) => purchase.user, { eager: false })
  purchases: Purchase[];


  /**
   * Registration for new user
   *
   * @throws USER_EMAIL_EXIST_EXCEPTION, NewUserDataError
   */
  static async createUser(newUserDto: NewUserDto): Promise<Users> {
    // check for password
    const password = newUserDto?.password;
    if (!password) {
      throw new NewUserDataError('Password required');
    }

    // check for email conflicts
    const match = await Users.findOne({
      where: {
        email: newUserDto?.email,
        active: true,
      },
    });

    if (match) {
      throw USER_EMAIL_EXIST_EXCEPTION;
    }

    // check for existing track
    const trackId = newUserDto.trackId;
    if (!trackId) {
      throw new NewUserDataError('Track id required');
    }
    const track = await Track.findOne({
      where: {
        id: trackId,
      },
    });
    if (!track) {
      throw new NewUserDataError('This track does not exist');
    }

    let user = await Users.findOne({
      where: {
        email: newUserDto?.email,
        active: false,
      },
    });

    if (!user) {
      user = new Users();
    }
    user.email = newUserDto?.email;
    user.firstName = newUserDto?.firstName || null;
    user.middleName = newUserDto?.middleName || null;
    user.lastName = newUserDto?.lastName || null;
    user.password = await Users.passwordCalcHash(password);
    user.track = track;
    user.active = true;
    await user.save();
    await user.reload();

    return user;
  }

  /**
   * Return flat list of purchased products
   */
  getPurchasedProducts() {
    const purchasedProducts = [];
    this.purchases.forEach((el) => {
      const match = purchasedProducts.find((p) => p.id === el.product.id);
      if (!match) {
        purchasedProducts.push(el.product);
      }
    });
    return purchasedProducts;
  }

  static async exportBalance(): Promise<BalanceImportDto[]> {
    const allUsers = await Users.find({
      relations: ['balance'],
    });
    const result = allUsers.map((user) => {
      return {
        email: user.email,
        delta: user.calcTotal(),
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
      };
    });
    return result;
  }

  /**
   * Create hash from provided password
   */
  static async passwordCalcHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  /**
   * Create and save hash from provided password
   */
  async passwordSave(password: string) {
    this.password = await Users.passwordCalcHash(password);
  }

  /**
   * Compare provided password with stored hash
   */
  async passwordVerify(password: string): Promise<boolean> {
    const hash = this.password;
    const result = await bcrypt.compare(password, hash);
    return result;
  }

  /**
   * Create new balance transactions entries, and new users if email has no match
   */
  static async importBalance(balanceDto: BalanceImportDto[]) {
    const getUsers = async () => {
      const emailsList = balanceDto.map((el) => el.email);
      const result = await Users.find({
        where: {
          email: In(emailsList),
        },
        relations: ['balance'],
      });
      return result;
    };
    const usersList = await getUsers();

    // search for new users
    /*
    const emailExisted = usersList.map((el) => el.email);
    const newEmails = [];
    balanceDto
      .filter((el) => {
        const result = emailExisted.indexOf(el.email) === -1;
        return result;
      })
      .forEach((el) => {
        if (newEmails.map((old) => old.email).indexOf(el.email) === -1) {
          newEmails.push(el);
        }
      });
    for (const index in newEmails) {
      const user = Users.create();
      user.email = newEmails[index].email;
      await user.save();
    }

    // refresh users list with new etnries
    usersList = await getUsers();
    */

    usersList.forEach(async (user) => {
      const newUserData = balanceDto.find((el) => el.email === user.email);

      /** @todo temporary disabled. Can be enabled with no repercursions */
      // user.firstName = newUserData?.firstName || null;
      // user.middleName = newUserData?.middleName || null;
      // user.lastName = newUserData?.lastName || null;
      // await user.save();

      const newDeltasList = balanceDto.filter((el) => el.email === user.email);
      const delta = newDeltasList.map((el) => Number(el.delta) || 0)?.reduce((p, n) => p + n) || 0;
      await user.addScoreDelta(delta);
    });
  }

  /**
   * This is an unsafe method. Usually it is better to use addScoreDelta
   */
  async createScoreDelta(delta: number, code?: string | number) {
    const newBalance = Balance.create();
    newBalance.value = Number(delta) || 0;
    newBalance.user = this;
    newBalance.code = code as TransactionCodeEnum ?? TransactionCodeEnum.INCOME;
    await newBalance.save();
  }

  async addScoreDelta(delta: number) {
    const total = this.calcTotal();

    // prevent negative total score
    if (total + delta < 0) {
      delta = total * -1;
    }

    // prevent zero deltas
    if (delta !== 0) {
      await this.createScoreDelta(delta);
      /*
      const newBalance = Balance.create();
      newBalance.value = Number(delta) || 0;
      newBalance.user = this;
      await newBalance.save();
      */
    }
  }

  /**
   * Calculate rating's score
   */
  calcScore() {
    const balance = this.balance;
    if (balance.length === 0) {
      return 0;
    }

    const filtered = balance.filter((el) => {
      return Number(el.code) === TransactionCodeEnum.INCOME;
    });
    const valuesList = filtered.map((el) => el.value);
    if (valuesList.length === 0) {
      return 0;
    }
    const result = valuesList?.reduce((p, n) => p + n) || 0;
    return result;
  }

  /**
   * Calculate total score
   */
  calcTotal() {
    const balance = this.balance;
    if (balance.length === 0) {
      return 0;
    }

    const valuesList = balance.map((el) => el.value);
    const result = valuesList?.reduce((p, n) => p + n) || 0;
    return result;
  }
}
