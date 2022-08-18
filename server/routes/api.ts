import info from '../controllers/info'
import router from 'koa-router'
const r = new router()
r.get('/info/id', info.getInfoByID); 
r.get('/info/user', info.getInfoOfUser);
r.get('/info/discover', info.getRandomInfo);
r.post('/info/change', info.createOrUpdateInfo);
r.delete('/info/deleteInfo', info.deleteInfo);
export default r;