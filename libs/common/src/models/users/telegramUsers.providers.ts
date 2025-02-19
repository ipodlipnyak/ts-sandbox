import { Provider } from "@nestjs/common";
import { DataSource } from "typeorm";
import { DI_TOKENS } from "@my/common/constants";
import { TelegramUsers } from "./telegramUsers.entity";

export const telegramUsersProvider: Provider[] = [
  {
    provide: DI_TOKENS.DATA_SOURCE.DEFAULT.REPOSITORIES.TELEGRAM_USERS,
    useFactory: (dataSource: DataSource) => {
      return dataSource.getRepository(TelegramUsers);
    },
    inject: [DI_TOKENS.DATA_SOURCE.DEFAULT.NAME]
  }
]
