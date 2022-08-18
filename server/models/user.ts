import { initModels,usersAttributes } from '../schema/init-models'
import { MHDb } from '../config/db'

const models = initModels(MHDb);
type userInfo = usersAttributes & {
  newPassword?: string
}

const queryUser = async (name: string) => {
  return await models.users.findOne({ where: { name } })
}
const createUser = async (user: userInfo) => {
  return await models.users.create(user).catch((e) => console.log(e));
}
const changeUserPwd = async (user: userInfo) => {
  return await models.users.update(
    {
      password: user.newPassword
    },
    {
      where: { name: user.name }
    }).catch((e) => console.log(e));
}
const deleteUser = async (name: string) => {
  return await models.users.destroy({
      where: { name, }
    }).catch((e) => console.log(e));
}
export default {
  queryUser,
  createUser,
  changeUserPwd,
  deleteUser,
}