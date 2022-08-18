import { Context } from 'koa';
import Info from '../models/info'
const getInfoOfUser = async (ctx: Context) => {
  const name = ctx.state.user.name;
  const result = await Info.queryInfoByUserName(name);
  ctx.body = result;
}
const getInfoByID = async (ctx: Context) => {
  const name = ctx.state.user.name;
  const result = await Info.queryInfoByID(ctx.query.id as string,name)
  ctx.body = result;
}

const createOrUpdateInfo = async (ctx: Context) => {
  const name = ctx.state.user.name;
  const data = ctx.request.body;
  await Info.createOrUpdateInfo(data,name)
  ctx.body = {
    status: 200,
    message: '添加或修改成功！'
  }
}
const deleteInfo = async (ctx: Context) => {
  const data = ctx.request.body as Array<string>;
  for (let i = 0; i < data.length; i++) {
    await Info.deleteInfo(data[i]);
  }
  ctx.body = {
    status: 200,
    message: '删除成功！'
  }
}
const getRandomInfo = async (ctx: Context) => {
  const name = ctx.state.user.name;
  const result = await Info.getRandomInfo(name)
  ctx.body = result;
}
export default {
  getInfoOfUser,
  getInfoByID,
  createOrUpdateInfo,
  deleteInfo,
  getRandomInfo
}