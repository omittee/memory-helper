import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/discover',
    name: 'discover',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/DiscoverView.vue')
  },
  {
    path: '/me',
    name: 'me',
    component: () => import('../views/MeSettingView.vue')
  },{
    path: '/login',
    name: 'login',
    component: () => import('../views/LogIn.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to,from,next)=>{
  if(to.path === '/discover'&&localStorage.getItem('mh-token')===null){
    next({name:'login',params:{from:from.path}})
  }
  else next();
})
export default router
