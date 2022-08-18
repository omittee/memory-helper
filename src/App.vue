<template>
  <van-tabbar v-model="active">
    <van-tabbar-item icon="home-o">
      <router-link to="/">首页</router-link>
    </van-tabbar-item>
    <van-tabbar-item icon="guide-o">
      <router-link to="/discover">发现</router-link>
    </van-tabbar-item>
    <van-tabbar-item icon="user-o">
      <router-link to="/me">我的</router-link>
    </van-tabbar-item>
  </van-tabbar>

  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component"></component>
    </keep-alive>
  </router-view>
</template>

<style lang="less">
.van-tabbar {
  z-index: 999;
  .van-tabbar-item--active .router-link-active {
    color: var(--van-primary-color);
  }
}
</style>

<script>
import { ref } from "vue";

export default {
  setup() {
    const active = ref(0);
    return { active };
  },
};
</script>
