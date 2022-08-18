<template>
  <div class="container">
    <van-collapse class="discoverBox" v-model="activeNames" accordion>
      <van-pull-refresh v-model="loading" @refresh="onRefresh">
        <van-empty
          v-show="!infoArr?.length"
          description="还没有人公开信息哦~"
        ></van-empty>
        <van-collapse-item
          v-for="item in infoArr"
          :key="item._id"
          :title="item.title"
          :is-link="false"
          name="discover"
          readonly
          title-class="item-font"
          value-class="item-right"
        >
          <template #label>
            <div>
              <span
                class="tags"
                v-for="(tag, order) in item.tags.trim().length
                  ? item.tags.trim().split(' ')
                  : []"
                :key="order"
              >
                {{ tag }}
              </span>
            </div>
          </template>
          <template #value>
            <van-button
              icon="star-o"
              round
              class="van-btn--custom"
              @click.stop="onAdd"
              :color="add ? 'var(--van-primary-color)' : ''"
            />
          </template>
          <div>
            <div class="question">
              <van-icon name="question-o" color="var(--van-primary-color)" />{{
                item.question
              }}
            </div>
            <van-divider
              :style="{
                color: 'var(--van-primary-color)',
                borderColor: 'var(--van-primary-color)',
              }"
            />
            <div class="content" @click="isBlur = !isBlur">
              <van-icon
                :name="isBlur ? 'closed-eye' : 'eye-o'"
                color="var(--van-primary-color)"
              />
              {{ isBlur ? "点此显示答案" : item.content }}
            </div>
          </div>
        </van-collapse-item>
      </van-pull-refresh>
    </van-collapse>
    <van-notify
      v-model:show="noteInfo.showNote"
      background="var(--van-primary-color)"
    >
      {{ noteInfo.currentMessage }}
    </van-notify>
  </div>
</template>
<style scoped lang="less">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: calc(100vh - 50px);
  background: radial-gradient(
    circle at 75px 40px,
    lighten(#1989fa, 45%),
    var(--van-primary-color)
  );
  .van-collapse.discoverBox {
    width: 85%;
    height: 85%;
    border-radius: 25px;
    background-color: #fff;
    border: 0;
    :deep(.van-cell__title.item-font) {
      display: block;
      font-size: 20px;
      flex-basis: content;
      max-width: fit-content;
      padding-left: 5px;
      border-left: 3px solid var(--van-primary-color);
    }
    :deep(.van-cell__value.item-right) {
      padding-right: 3px;
      min-width: 8%;
    }
    .van-pull-refresh {
      width: 100%;
      height: 100%;
      border-radius: 25px;
      overflow: auto;
    }
    .tags {
      display: inline-block;
      width: auto;
      height: 20px;
      line-height: 20px;
      text-align: center;
      padding: 0 10px;
      margin: 5px 6px 2px 0;
      border-radius: 10px;
      background-color: #eee;
      color: var(--van-primary-color);
    }
    .van-btn--custom {
      width: 24px;
      height: 24px;
      padding: 0;
      border: 0;
    }
  }
}
</style>
<script lang="ts">
import { defineComponent } from "vue";
import { Collapse, CollapseItem } from "vant";
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
      activeNames: "discover",
      infoArr: [] as Info[],
      isBlur: true,
      loading: false,
      add: false,
      noteInfo: {
        showNote: false,
        currentMessage: "",
      },
    };
  },
  methods: {
    showToast(message: string) {
      this.noteInfo.currentMessage = message;
      this.noteInfo.showNote = true;
      setTimeout(() => {
        this.noteInfo.showNote = false;
      }, 1000);
    },
    async onRefresh() {
      this.add = false;
      this.isBlur = true;
      const info = await this.$axios
        .get("/api/info/discover")
        .catch((e) => console.log(e));
      this.loading = false;
      if (!info||!info.data) {
        return (this.infoArr = []);
      }
      info.data._id = this.$nanoid(10);
      info.data.createdTime = info.data.lastModified = new Date().getTime();
      info.data.isPublic = false;
      this.infoArr = [info.data];
    },
    onAdd() {
      this.add = !this.add;
      if (this.add) {
        this.$localforage
          .setItem(this.infoArr[0]._id, { ...this.infoArr[0] })
          .then(() => {
            this.showToast("添加成功！");
          })
          .catch((e) => console.log(e));
        this.$axios
          .post("/api/info/change", [this.infoArr[0]])
          .catch((e) => console.log(e));
      } else {
        this.$localforage
          .removeItem(this.infoArr[0]._id)
          .then(() => {
            this.showToast("移除成功！");
          })
          .catch((e) => console.log(e));
        this.$axios
          .delete("/api/info/deleteInfo", {
            data: [this.infoArr[0]._id],
          })
          .catch(() => {
            let arr = JSON.parse(localStorage.getItem("mh-del") ?? "[]");
            arr.push(this.infoArr[0]._id);
            localStorage.setItem("mh-del", JSON.stringify(arr));
          });
      }
    },
  },
  created() {
    this.onRefresh();
  },
  components: {
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
  },
});
</script>
