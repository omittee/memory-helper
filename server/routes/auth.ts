// routes/auth.js

import user from '../controllers/user'
import router from 'koa-router'
const r = new router()
r.get('/user', user.getUserByName);  //127.0.0.1:3000/auth/user/?name=omit
r.post('/user/login', user.login);
r.post('/user/register', user.register);
r.put('/user/changeUserPwd', user.changeUserPwd);
r.delete('/user/deleteUser', user.deleteUser);
export default r;