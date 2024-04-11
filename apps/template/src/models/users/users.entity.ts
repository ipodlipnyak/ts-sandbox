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
import { Friendsheep } from './friendsheep.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { ID } from 'type-graphql';
import { randomUUID } from 'crypto';
// import { EventUser } from './../event';

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
// @ObjectType()
export class Users extends BaseEntity {
  // @Field(() => ID)
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

  // @Field()
  @Column({
    nullable: true,
    unique: true,
  })
  email: string;

  @Column({
    nullable: true,
  })
  pictureUrl: string;

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

  // @Field(type => Users)
  @OneToMany(() => Friendsheep, (friendsheep) => friendsheep.user, { eager: false })
  friends: Friendsheep[];

  /*
  @ManyToOne(() => EventUser, (event) => event.user, {
    onDelete: 'SET NULL',
    eager: false,
    nullable: true,
  })
  events: EventUser;
  */


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
   * Create a user if required with new email and subscribe each other profiles
   *
   * @param email for a new friend
   * @returns new friend's user model
   */
  async makeFriend(email: string) {
    if (!email) {
      return;
    }

    let friend = await Users.findOne({
      where: { email: email },
    });

    if (!friend) {
      friend = new Users();
      friend.email = email;
      friend.active = true;
      await friend.save();
      await friend.reload();
    }

    await this.subscribe(email);
    await friend.subscribe(this.email);

    await friend.reload();
    return friend;
  }

  /**
   *
   * @param email
   * @returns
   */
  async unmakeFriend(email: string) {
    if (!email) {
      return;
    }

    let friend = await Users.findOne({
      where: { email: email },

    });
    if (!friend) {
      return;
    }

    await this.unsubscribe(email);
    await friend.unsubscribe(this.email);
  }

  /**
   * Check if user have a friend with admin role
   *
   * @returns boolean
   */
  async isFriendWithAdmins() {
    // i am an admin
    if (this.role >= UserRole.ADMIN) {
      return true;
    }

    const query = `
      id IN (
        select f1."friendId"
        from friendsheep f1
        inner join friendsheep f2 on f1."userId" = f2."friendId" and f1."friendId" = f2."userId"
        where f1."userId" = '${this.id}'
      ) and role >= ${UserRole.ADMIN}
    `;
    const result = await Users.createQueryBuilder().where(query).getExists();
    return result;
  }

  /**
   * Remove friendsheep from one side
   *
   * @param email friend to break with
   * @returns
   */
  async unsubscribe(email: string) {
    if (!email) {
      return;
    }

    const query = `
    id IN (
      select f1."friendId"
      from friendsheep f1
      where f1."userId" = '${this.id}'
    ) and email = '${email}';
    `;
    const friend = await Users.createQueryBuilder().where(query).getOne();
    if (!friend) {
      return;
    }
    const friendsheep = await Friendsheep.findOne({
      where: {
        user: { id: this.id },
        friend: { id: friend.id },
      }
    });

    const result = await friendsheep.remove();

    // remove this user if there is no admin to check on him
    const isFriendWithAdmin = await this.isFriendWithAdmins();
    if (!isFriendWithAdmin) {
      this.remove();
    }

    return result;
  }

  /**
   * Remove friendsheep from other side
   *
   * @param email follower to kick off
   * @returns
   */
  async unfollow(email: string) {
    if (!email) {
      return;
    }

    const query = `
    id IN (
      select f1."userId"
      from friendsheep f1
      where f1."friendId" = '${this.id}'
    ) and email = '${email}';
    `;
    const follower = await Users.createQueryBuilder().where(query).getOne();
    if (!follower) {
      return;
    }
    const friendsheep = await Friendsheep.findOne({
      where: {
        friend: { id: this.id },
        user: { id: follower.id },
      }
    });
    const result = await friendsheep.remove();

    // remove this user if there is no admin to check on him
    const isFriendWithAdmin = await follower.isFriendWithAdmins();
    if (!isFriendWithAdmin) {
      follower.remove();
    }

    return result;
  }

  /**
   * Invite somebody to be a friend. In meentime you are subscribed to him
   *
   * @param email to subscribe
   * @returns
   */
  async subscribe(email: string) {
    if (!email) {
      return;
    }

    const query = `
    id IN (
      select f1."friendId"
      from friendsheep f1
      where f1."userId" = '${this.id}'
    ) and email = '${email}';
    `;
    const subscribtion = await Users.createQueryBuilder().where(query).getOne();
    if (subscribtion) {
      return subscribtion;
    }

    const friend = await Users.findOne({
      where: { email: email },
      // relations: { friends: true },
    });

    if (!friend) {
      return null;
    }

    const friendsheep = new Friendsheep();
    friendsheep.user = this;
    friendsheep.friend = friend;
    await friendsheep.save();
    await friendsheep.reload();
    return friendsheep.friend;
  }

  /**
   * We both accepted this friendsheep
   *
   * @returns Users[]
   */
  async getFriends() {
    const query = `
      id IN (
        select f1."friendId"
        from friendsheep f1
        inner join friendsheep f2 on f1."userId" = f2."friendId" and f1."friendId" = f2."userId"
        where f1."userId" = '${this.id}'
      );
    `;
    const result = await Users.createQueryBuilder().where(query).getMany();
    return result;
  }

  /**
   * He invited me to be a friend. So he is my follower
   6dbe38ce-0e2e-4b7f-9fdc-f4908da73a19*
   * @returns Users[]
   */
  async getFollowers() {
    const query = `
        id in (
          select sub from (
            select f1."userId" as sub, f2."userId" as obj
            from friendsheep f1
            left outer join friendsheep f2 on f1."userId" = f2."friendId" and f1."friendId" = f2."userId"
            where f1."friendId" = '${this.id}'
        ) as rel where rel.obj is NULL
      )
      ;
    `;
    const result = await Users.createQueryBuilder().where(query).getMany();
    return result;
  }

  /**
   * I invited him to be a friend. So i am subscribed for him
   *
   * @returns Users[]
   */
  async getSubscriptions() {
    const query = `
        id in (
          select obj from (
            select f1."friendId" as obj, f2."friendId" as sub
            from friendsheep f1
            left outer join friendsheep f2 on f1."userId" = f2."friendId" and f1."friendId" = f2."userId"
            where f1."userId" = '${this.id}'
        ) as rel where rel.sub is NULL
      )
      ;
    `;
    const result = await Users.createQueryBuilder().where(query).getMany();
    return result;
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
