import type { Sequelize } from "sequelize";
import { info as _info } from "./info";
import type { infoAttributes, infoCreationAttributes } from "./info";
import { users as _users } from "./users";
import type { usersAttributes, usersCreationAttributes } from "./users";

export {
  _info as info,
  _users as users,
};

export type {
  infoAttributes,
  infoCreationAttributes,
  usersAttributes,
  usersCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const info = _info.initModel(sequelize);
  const users = _users.initModel(sequelize);


  return {
    info: info,
    users: users,
  };
}
