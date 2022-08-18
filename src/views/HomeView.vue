<template>
  <div class="home addPadding">
    <div class="topBox">
      <van-search
        v-model="searchValue"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        input-align="center"
      />
    </div>
    <!-- <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <p>刷新次数: {{ count }}</p>
    </van-pull-refresh> -->
    <div>
      <MemoryInfo :infoArr="infoDataArr" @changeInfo="changeInfo" ref="memi" />
    </div>
  </div>
</template>
<style lang="less">
.home {
  width: 100%;
  height: 84vh;
}
.addPadding {
  padding: 54px 0 50px;
}
.topBox {
  position: fixed;
  top: 0;
  width: 65%;
  height: 54px;
  border-bottom: #1989fa 2px;
  z-index: 900;
}
</style>
<script lang="ts">
import { defineComponent } from "vue";
import { Search } from "vant";
import MemoryInfo from "@/components/MemoryInfo.vue"; 
interface Info {
  user_name: string;
  _id: string;
  title: string;
  tags: string;
  question: string;
  content: string;
  isPublic: boolean;
  createdTime: number;
  lastModified: number;
}
export default defineComponent({
  data() {
    return {
      infoDataArr: [] as Array<Info>,
      searchValue: "",
      reg: null,
      isSearch: false,
    };
  },
  methods: {
    onSearch() {
      this.isSearch = true;
      this.searchValue = this.searchValue.trim();
      if (!this.searchValue.length) return this.onCancel();

      let r: RegExp;
      if (/^\/.+\/[img]*$/.test(this.searchValue)) {
        r = new RegExp(
          /(?<=\/).+(?=\/)/.exec(this.searchValue)?.[0] as string,
          /[img]*$/.exec(this.searchValue)?.[0]
        );
      } else if (/^#\s*\S+$/.test(this.searchValue)) {
        r = new RegExp(
          (/(?<=#\s*)\S+/.exec(this.searchValue)?.[0] as string).trim()
        );
        return this.updateInfo()
          .then((x) => {
            this.infoDataArr = (x as Info[]).filter((item: Info) =>
              r.test(item.tags)
            );
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        r = new RegExp(this.searchValue);
      }
      this.updateInfo()
        .then((x) => {
          this.infoDataArr = (x as Info[]).filter((item: Info) =>
            r.test(item.title)
          );
        })
        .catch((e) => {
          console.log(e);
        });
    },
    onCancel() {
      this.isSearch = false;
      this.updateInfo();
    },
    changeInfo() {
      this.isSearch ? this.onSearch() : this.updateInfo();
    },
    updateInfo() {
      let arr: Array<Info> = [];
      return this.$localforage
        .iterate((item) => {
          arr.push(item as Info);
        })
        .then(() => {
          return (this.infoDataArr = arr.sort(
            (a, b) => b.createdTime - a.createdTime
          ));
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  activated() {
    this.updateInfo();
  },
  components: {
    MemoryInfo,
    [Search.name]: Search,
  },
});
</script>
