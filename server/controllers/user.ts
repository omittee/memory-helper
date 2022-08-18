import { Context } from 'koa';
import { sign } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { secret } from '../config/jwt'
import User from '../models/user'

const getUserByName = async function (ctx: Context) {
  const result = await User.queryUser(ctx.query.name as string);  // 通过await “同步”地返回查询结果
  ctx.body = result // 将请求的结果放到response的body里返回
}
const login = async function (ctx: Context) {
  const data = ctx.request.body; // post过来的数据存在request.body里
  const userInfo = await User.queryUser(data.name);
  if (userInfo !== null) { // 如果查无此用户会返回null
    if (!bcrypt.compareSync(data.password, userInfo.password)) {
      ctx.body = {
        status: 403,
        message: '密码错误！'
      }
    } else { // 如果密码正确
      const userToken = {
        name: userInfo.name,
        id: userInfo.id
      }
      const token = sign(userToken, secret); // 签发token
      ctx.body = {
        status: 200,
        token: token, // 返回token
        name: userInfo.name,
      }
    }
  } else {
    ctx.body = {
      status: 404,
      message: '用户不存在！' // 如果用户不存在返回用户不存在
    }
  }
}
const register = async function (ctx: Context) {
  const data = ctx.request.body
  const sameUserName = await User.queryUser(data.name);

  if (sameUserName === null) {
    await User.createUser(data)
    ctx.body = {
      status: 200,
      message: '注册成功'
    }
  } else {
    ctx.body = {
      status: 403,
      message: '该用户名已被注册'
    }
  }
};
const changeUserPwd = async function (ctx: Context) {
  const data = ctx.request.body; // post过来的数据存在request.body里
  const userInfo = await User.queryUser(data.name);
  if (userInfo !== null) { // 如果查无此用户会返回null
    if (!bcrypt.compareSync(data.password, userInfo.password)) {
      ctx.body = {
        status: 403,
        message: '原密码错误！'
      }
    } else {
      await User.changeUserPwd(data);
      ctx.body = {
        status: 200,
        message: '密码修改成功！',
      }
    }
  } else {
    ctx.body = {
      status: 404,
      message: '用户不存在！'
    }
  }
}
const deleteUser = async function (ctx: Context) {
  const data = ctx.request.body; 
  const userInfo = await User.queryUser(data.name);
  if (userInfo !== null) { // 如果查无此用户会返回null
    if (!bcrypt.compareSync(data.password, userInfo.password)) {
      ctx.body = {
        status: 403,
        message: '密码错误！'
      }
    } else {
      await User.deleteUser(data.name);
      ctx.body = {
        status: 200,
        message: '账号注销成功！',
      }
    }
  } else {
    ctx.body = {
      status: 404,
      message: '用户不存在！'
    }
  }
}
export default {
  getUserByName,
  login,
  register,
  changeUserPwd,
  deleteUser
}