<template>
  <!-- <div class="filter"></div> -->
  <van-overlay :show="editInfo.showEdit">
    <div class="wrapper" @click="editInfo.showEdit = false">
      <van-form @submit="submit" class="form" @click.stop>
        <van-cell-group inset>
          <van-field
            v-model="infoData.title"
            name="标题"
            label="标题"
            placeholder="标题(必填)"
            maxlength="50"
            show-word-limit
            :rules="[{ required: true, message: '请填写标题' }]"
          />
          <van-field
            v-model="infoData.question"
            name="问题"
            label="问题"
            placeholder="问题(必填)"
            type="textarea"
            maxlength="20000"
            :autosize="{ maxHeight: 50 }"
            :rules="[{ required: true, message: '请填写问题' }]"
          />
          <van-field
            v-model="infoData.content"
            name="内容"
            label="内容"
            placeholder="内容(必填)"
            type="textarea"
            maxlength="8000000"
            :autosize="{ maxHeight: 100 }"
            :rules="[{ required: true, message: '请填写内容' }]"
          />
          <van-field
            v-model="infoData.tags"
            name="标签"
            label="标签"
            placeholder="标签(请用空格分隔)"
            maxlength="100"
            show-word-limit
          />
        </van-cell-group>
        <div style="margin: 16px">
          <van-button
            round
            block
            native-type="submit"
            color="var(--van-primary-color)"
          >
            提交
          </van-button>
        </div>
      </van-form>
    </div>
  </van-overlay>

  <van-overlay :show="delInfo.showDelete">
    <my-dialog
      :show="delInfo.showDelete"
      :title="delInfo.title"
      @confirm="confirm"
      @cancel="cancel"
    ></my-dialog>
  </van-overlay>

  <van-notify
    v-model:show="noteInfo.showNote"
    background="var(--van-primary-color)"
  >
    {{ noteInfo.currentMessage }}
  </van-notify>

  <div class="operator">
    <van-button
      icon="orders-o"
      round
      class="topBox-btn"
      :color="
        activeNames.length && activeNames.length == infoArr?.length
          ? 'var(--van-primary-color)'
          : ''
      "
      @click="toggleAll"
    />
    <van-button
      icon="delete-o"
      round
      class="topBox-btn"
      @click="
        (delInfo.showDelete = true), (delInfo.title = '确定要删除全部吗？')
      "
    ></van-button>
    <van-button
      icon="plus"
      round
      class="topBox-btn"
      @click="addInfo"
    ></van-button>
    <van-button
      icon="back-top"
      round
      class="topBox-btn"
      @click="scrolltoTop"
    ></van-button>
  </div>
  <van-pull-refresh v-model="loading" @refresh="synchronize">
    <van-empty v-show="!infoArr?.length" description="这里空空如也~">
      <van-button round class="bottom-button" @click="addInfo">添加</van-button>
    </van-empty>
    <van-collapse v-model="activeNames" class="collapse">
      <TransitionGroup name="disapper" tag="van-collapse">
        <van-collapse-item
          v-for="(item, index) in infoArr"
          :key="item._id"
          :name="item._id"
          size="large"
          title-class="item-font"
          value-class="item-right"
          label-class="item-left"
        >
          <template #title>
            <!-- <div class="van-multi-ellipsis--l2"> -->
            {{ item.title }}
            <!-- </div> -->
          </template>
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
              icon="edit"
              round
              class="van-btn--custom"
              @click.stop="
                (editInfo.showEdit = true),
                  (editInfo.isAdd = false),
                  (infoData = item),
                  (infoData.lastModified = new Date().getTime())
              "
            />
            <van-button
              icon="delete-o"
              round
              class="van-btn--custom"
              @click.stop="
                (delInfo.showDelete = true),
                  (delInfo.currentDeleteID = item._id),
                  (delInfo.title = '确定要删除吗？')
              "
            />
            <van-button
              icon="label-o"
              round
              :class="
                item.isPublic ? 'van-btn--custom active' : 'van-btn--custom'
              "
              @click.stop="testAuth(() => public(item))"
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
            <div class="content" @click="isBlur[index] = !isBlur[index]">
              <van-icon
                :name="isBlur[index] ? 'closed-eye' : 'eye-o'"
                color="var(--van-primary-color)"
              />
              {{ isBlur[index] ? "点此显示答案" : item.content }}
            </div>
          </div>
        </van-collapse-item>
      </TransitionGroup>
    </van-collapse>
  </van-pull-refresh>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
:deep(.van-field__label) {
  max-width: 12%;
}
@keyframes dh {
  from{
    opacity: 1;
    scale: 1;
  }
  to {
    opacity: 0;
    transform: scaleY(0.01) translateX(30px);
  }
}
// :deep(.disapper-move.disapper-enter-active,
// .disapper-move.disapper-leave-active) {
//   transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
// }
/* 2. 声明进入和离开的状态 */

:deep(.disapper-enter-active) {
  animation: dh 0.5s cubic-bezier(0.55, 0, 0.1, 1) both reverse;
}
:deep(.disapper-leave-active) {
  animation: dh 0.5s cubic-bezier(0.55, 0, 0.1, 1) both;
}


.van-overlay {
  z-index: 999;
}
.filter {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: radial-gradient(
      circle at 75px 40px,
      lighten(#1989fa, 45%),
      var(--van-primary-color)
    ),
    radial-gradient(
      circle at 70vw 80vh,
      lighten(#1989fa, 45%),
      var(--van-primary-color)
    );
  pointer-events: none;
  z-index: 100;
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  .form {
    position: relative;
  }
}
.operator {
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  flex-grow: 0;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 900;
  width: 35%;
  height: 54px;
  background-color: #fff;
  .van-button.topBox-btn {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    border: none;
    margin: 0 2px;
    padding: 0;
  }
}
:deep(.bottom-button) {
  width: 160px;
  height: 40px;
  background-color: var(--van-primary-color);
  color: #fff;
  border: 0;
}
.van-empty {
  height: 85vh;
}
.van-collapse {
  height: 100vh;
}
:deep(.van-cell__title.item-font) {
  display: block;
  font-size: 20px;
  flex-basis: content;
  max-width: fit-content;
  padding-left: 5px;
  border-left: 3px solid var(--van-primary-color);
  // background-color: yellow;
}
:deep(.van-cell__value.item-right) {
  padding-right: 3px;
  min-width: 10%;
}
.van-btn--custom {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  background-color: transparent;
}
.van-btn--custom:active,
:deep(.active) {
  color: var(--van-primary-color);
}
.question,
.content {
  font-size: 16px;
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
</style>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import {
  Collapse,
  CollapseItem,
  Divider,
  Form,
  Field,
  CellGroup,
  Notify,
} from "vant";
import MyDialog from "@/components/MyDialog.vue";
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
  props: {
    infoArr: Array as unknown as PropType<Info[]>,
  },
  data() {
    return {
      activeNames: [],
      isBlur: Array(this.infoArr?.length).fill(true),
      loading: false,
      editInfo: {
        showEdit: false,
        currentEditID: -1,
        isAdd: false,
      },
      delInfo: {
        showDelete: false,
        currentDeleteID: "",
        title: "",
      },
      noteInfo: {
        showNote: false,
        currentMessage: "",
      },
      infoData: {
        _id: "",
        title: "",
        tags: "",
        question: "",
        content: "",
        isPublic: false,
        createdTime: 0,
        lastModified: 0,
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
    testAuth(fn: () => void) {
      if (this.$token) fn();
      else {
        this.showToast("请先登录！");
        setTimeout(() => {
          this.$router.replace({ name: "login", params: { from: "/me" } });
        }, 1200);
      }
    },
    toggleAll() {
      (this.activeNames as string[] | undefined) = this.activeNames.length
        ? []
        : this.infoArr?.map((x) => x._id);
    },
    async submit() {
      await this.$localforage
        .setItem(this.infoData._id, { ...this.infoData })
        .then(() => {
          this.$emit("changeInfo");
          this.editInfo.showEdit = false;
          this.showToast(this.editInfo.isAdd ? "添加成功！" : "修改成功！");
        })
        .catch((e) => console.log(e));
      await this.$axios
        .post("/api/info/change", [this.infoData])
        .catch((e) => console.log(e));
    },
    async confirm() {
      if (this.delInfo.currentDeleteID) {
        const id = this.delInfo.currentDeleteID;
        this.$localforage
          .removeItem(this.delInfo.currentDeleteID)
          .then(() => {
            this.delInfo.showDelete = false;
            this.delInfo.currentDeleteID = "";
          })
          .catch((e) => console.log(e));

        this.$axios
          .delete("/api/info/deleteInfo", {
            data: [id],
          })
          .catch(() => {
            let arr = JSON.parse(localStorage.getItem("mh-del") ?? "[]");
            arr.push(id);
            localStorage.setItem("mh-del", JSON.stringify(arr));
          });
      } else {
        let delArr = await this.$localforage
          .keys()
          .catch((e) => console.log(e));
        this.$localforage
          .clear()
          .then(() => {
            this.delInfo.showDelete = false;
            this.delInfo.currentDeleteID = "";
          })
          .catch((e) => console.log(e));

        if (!delArr) return;

        this.$axios
          .delete("/api/info/deleteInfo", {
            data: delArr,
          })
          .catch(() => {
            let arr = JSON.parse(localStorage.getItem("mh-del") ?? "[]");
            arr = [...arr, ...(delArr as Array<string>)];
            localStorage.setItem("mh-del", JSON.stringify(arr));
          });
      }
      this.showToast("删除成功！");
      this.$emit("changeInfo");
    },
    cancel() {
      this.delInfo.showDelete = false;
    },
    public(item: Info) {
      item.isPublic = !item.isPublic;
      item.lastModified = new Date().getTime();
      this.$localforage.setItem(item._id, { ...item }).then(() => {
        this.showToast(item.isPublic ? "公开成功！" : "取消公开成功！");
        this.$emit("changeInfo");
      });
      this.$axios.post("/api/info/change", [item]).catch((e) => console.log(e));
    },
    addInfo() {
      this.infoData = {
        _id: this.$nanoid(10),
        title: "",
        tags: "",
        question: "",
        content: "",
        isPublic: false,
        createdTime: new Date().getTime(),
        lastModified: new Date().getTime(),
      };
      this.editInfo.showEdit = true;
      this.editInfo.isAdd = true;
    },
    async synchronize() {
      let arr: Array<Info> = [];
      await this.$localforage
        .iterate((item) => {
          arr.push(item as Info);
        })
        .catch((e) => {
          console.log(e);
        });
      if (arr.length) {
        await this.$axios
          .post("/api/info/change", arr)
          .catch((e) => console.log(e));
      }
      const delArr = JSON.parse(localStorage.getItem("mh-del") ?? "[]");
      if (delArr.length) {
        await this.$axios
          .delete("/api/info/deleteInfo", {
            data: delArr,
          })
          .then(() => {
            localStorage.removeItem("mh-del");
          })
          .catch((e) => console.log(e));
      }
      //拉取并更新数据
      await this.$axios
        .get("/api/info/user")
        .then((getRes) => {
          (getRes.data as unknown as Info[]).forEach((item) => {
            this.$localforage.getItem(item._id).then((x) => {
              if (!x || (x as Info).lastModified < item.lastModified) {
                this.$localforage
                  .setItem(item._id, item)
                  .catch((e) => console.log(e));
              }
            });
          });
        })
        .catch((e) => console.log(e));
      this.loading = false;
    },
    scrolltoTop() {
      let body = document.documentElement;
      let timer = setInterval(() => {
        if (!body.scrollTop) clearInterval(timer);
        body.scrollTop = Math.floor((body.scrollTop * 9) / 10);
      }, 20);
    },
  },
  watch: {
    infoArr: {
      handler(n) {
        this.isBlur = Array(n.length).fill(true);
      },
      deep: true,
    },
  },

  emits: ["changeInfo"],
  components: {
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [Divider.name]: Divider,
    [Form.name]: Form,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Notify.name]: Notify,
    MyDialog,
  },
});
</script>
