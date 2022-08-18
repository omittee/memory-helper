import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Tabbar, TabbarItem, Icon, Button, Popover, Overlay, PullRefresh, Empty } from 'vant';
import localforage from "@/storage/db";
import { nanoid } from "nanoid";
import axios, { AxiosStatic } from 'axios';
const app = createApp(App)
  .use(router)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Icon)
  .use(Button)
  .use(Popover)
  .use(Overlay)
  .use(PullRefresh)
  .use(Empty);

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('mh-token');
  if (token) config.headers!.Authorization = "Bearer " + token;
  return config;
},
  error => {
    return Promise.reject(error);
  })


app.config.globalProperties.$token = localStorage.getItem('mh-token');
app.config.globalProperties.$localforage = localforage;
app.config.globalProperties.$nanoid = nanoid;
app.config.globalProperties.$axios = axios;

app.mount('#app');

declare module 'vue' {
  interface ComponentCustomProperties {
    $token: string | null,
    $localforage: LocalForage,
    $axios: AxiosStatic,
    $nanoid: (size?: number) => string,
    // $translate: (key: string) => string
  }
}