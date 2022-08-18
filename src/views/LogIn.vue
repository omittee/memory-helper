<template>
  <div class="container">
    <van-notify
      v-model:show="noteInfo.showNote"
      background="var(--van-primary-color)"
    >
      {{ noteInfo.currentMessage }}
    </van-notify>

    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="user.name"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
          clearable
          maxlength="20"
          show-word-limit
          :error-message="errMsg.nameErr"
        />
        <van-field
          v-model="user.password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
          clearable
          :error-message="errMsg.pwdErr"
        />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block native-type="submit" class="bottom-button">
          {{ isRegister ? "注册" : "登录" }}
        </van-button>
      </div>
      <div class="toggle" @click="isRegister = !isRegister">
        {{ isRegister ? "已有账号？点击登录" : "还没有账号？点击注册" }}
      </div>
    </van-form>
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
  .van-form {
    width: 90%;
    .bottom-button {
      background-color: var(--van-primary-color);
      color: #fff;
      border: 0;
    }
    .toggle {
      text-align: center;
      font-size: 12px;
      text-decoration: underline;
      color: var(--van-primary-color);
    }
  }
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
<script lang="ts">
import { defineComponent } from "vue";
import { Form, Field, CellGroup } from "vant";
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
      isShowDoc: false,
      noteInfo: {
        showNote: false,
        currentMessage: "",
      },
      user: {
        name: "",
        password: "",
      },
      errMsg: {
        nameErr: "",
        pwdErr: "",
      },
      isRegister: false,
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
    },
    onSubmit() {
      this.errMsg.nameErr = this.errMsg.pwdErr = "";
      if (this.isRegister) {
        this.$axios
          .post("/auth/user/register", this.user)
          .then((res) => {
            if (res.data.status == 200) {
              this.showToast(res.data.message);
            } else {
              this.errMsg.nameErr = res.data.message;
            }
          })
          .catch((e) => console.log(e));
      } else {
        this.$axios
          .post("/auth/user/login", this.user)
          .then((postRes) => {
            if (postRes.data.status == 200) {
              this.showToast("登录成功！");
              this.user.name = this.user.password = "";
              //存token
              localStorage.setItem("mh-token", postRes.data.token);
              localStorage.setItem("mh-userName", postRes.data.name);
              const path = (this.$route.params.from as string) ?? "/";
              setTimeout(() => {
                this.$router.replace({ path });
              }, 1000);
              //同步数据
              this.synchronize();
            } else if (postRes.data.status == 404) {
              this.errMsg.nameErr = postRes.data.message;
            } else {
              this.errMsg.pwdErr = postRes.data.message;
            }
          })
          .catch((e) => console.log(e));
      }
    },
  },
  activated() {
    console.log(this.$route.params.from);
  },
  components: {
    [Form.name]: Form,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
  },
});
</script>
