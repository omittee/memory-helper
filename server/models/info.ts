import { initModels, infoAttributes } from '../schema/init-models'
import { MHDb } from '../config/db'
import { Op } from 'sequelize'
const models = initModels(MHDb);

const queryInfoByUserName = async (name: string) => {
  return await models.info.findAll(
    {
      where: {
        user_name: name
      },
      order: [
        ['createdTime', 'DESC'],
      ]
    }
  ).catch((e) => console.log(e));
}
const queryInfoByID = async (_id: string, user_name: string) => {
  return await models.info.findOne({ where: { _id, user_name } }).catch((e) => console.log(e));
}
const createOrUpdateInfo = async (info: infoAttributes[], name: string) => {
  for (let i = 0; i < info.length; i++) {
    info[i].user_name = name;
    models.info.findOne({ where: { _id: info[i]._id } }).then((res) => {
      if (res) {
        models.info.update(
          info[i],
          {
            where: {
              _id: info[i]._id,
              lastModified: {
                [Op.lt]: info[i].lastModified
              }
            }
          }).catch((e) => console.log(e));
      }
      else {
        models.info.create(info[i]).catch((e) => console.log(e));
      }
    }).catch((e) => console.log(e))
  }
}
const deleteInfo = async (_id: string) => {
  return await models.info.destroy({
    where: { _id }
  }).catch((e) => console.log(e));
}
const getRandomInfo = async (name: string) => {
  return await models.info.findOne(
    {
      where: {
        user_name: {
          [Op.not]: name
        },
        isPublic: true
      },
      order: MHDb.random()
    }
  ).catch((e) => console.log(e));
}
export default {
  queryInfoByUserName,
  queryInfoByID,
  createOrUpdateInfo,
  deleteInfo,
  getRandomInfo
}