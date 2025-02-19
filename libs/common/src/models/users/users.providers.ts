import { Provider } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Users } from "./users.entity";
import { DI_TOKENS } from "@my/common/constants";

export const usersProvider: Provider[] = [
  {
    provide: DI_TOKENS.DATA_SOURCE.DEFAULT.REPOSITORIES.USERS,
    useFactory: (dataSource: DataSource) => {
      return dataSource.getRepository(Users);
    },
    inject: [DI_TOKENS.DATA_SOURCE.DEFAULT.NAME]
  }
]
