# memory-helper
## 项目目录

```
memory-helper
├── app.ts                  # koa入口文件
├── babel.config.js
├── components.d.ts
├── package-lock.json
├── package.json
├── public 
│   ├── favicon.ico
│   ├── images
│   │   ├── changePwd.png
│   │   ├── deleteUser.png
│   │   ├── export.png
│   │   ├── import.png
│   │   ├── switchUser.png
│   │   └── userExit.png
│   └── index.html
├── server                  # 服务端
│   ├── config
│   │   ├── db.ts
│   │   └── jwt.ts
│   ├── controllers
│   │   ├── info.ts
│   │   └── user.ts
│   ├── models
│   │   ├── info.ts
│   │   └── user.ts
│   ├── routes
│   │   ├── api.ts
│   │   └── auth.ts
│   └── schema
│       ├── info.ts
│       ├── init-models.ts
│       └── users.ts
├── src                     # 客户端
│   ├── App.vue
│   ├── assets
│   │   └── logo.png
│   ├── components
│   │   ├── MemoryInfo.vue
│   │   └── MyDialog.vue
│   ├── main.ts  //vue入口文件
│   ├── router
│   │   └── index.ts
│   ├── shims-vue.d.ts
│   ├── storage
│   │   └── db.ts
│   └── views
│       ├── DiscoverView.vue
│       ├── HomeView.vue
│       ├── LogIn.vue
│       └── MeSettingView.vue
├── README.md
├── tsconfig.json
└── vue.config.js

```

## 介绍

一个用于帮助知识点记忆的练手小项目  

### 前端

` vue`、CSS预处理器：`less`、组件库：`vant`、存储库：`localforage`、HTTP库：`axios`

### 后端

`koa`、数据库：`MySQL`、ORM ：`sequelize`、加密：`Bcrypt`、鉴权：`jwt`

语言：`TypeScript`

## 收获

前后端交互，鉴权

## 不足

组件结构处理不是很好，UI报看，ts代码十分不优雅orz，很多技术只进行初级应用
