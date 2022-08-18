<template>
  <div class="container">
    <van-cell-group inset class="cells">
      <van-cell
        :title="user.name ? '用户名：' + user.name : '未登录（点击登录）'"
        clickable
        @click="
          user.name
            ? null
            : $router.replace({ name: 'login', params: { from: '/me' } })
        "
      />
    </van-cell-group>
    <van-cell-group inset class="cells">
      <van-cell
        title="修改密码"
        icon="/images/changePwd.png"
        is-link
        clickable
        @click="
          testAuth(() => {
            isChangePwd = true;
          })
        "
      />
      <van-cell
        title="切换账号"
        icon="/images/switchUser.png"
        is-link
        clickable
        @click="
          testAuth(() => {
            operateUser.isShow = true;
            operateUser.optype = 'switch';
            operateUser.title = '确定要切换账号吗';
          })
        "
      >
      </van-cell>
      <van-cell
        title="退出账号"
        icon="/images/userExit.png"
        is-link
        clickable
        @click="
          testAuth(() => {
            operateUser.isShow = true;
            operateUser.optype = 'exit';
            operateUser.title = '确定要退出登录吗';
          })
        "
      />
      <van-cell
        title="注销账号"
        icon="/images/deleteUser.png"
        is-link
        clickable
        @click="
          testAuth(() => {
            operateUser.isShow = true;
            operateUser.optype = 'delete';
            operateUser.title = `确定要注销账号吗\n注销账号则线上数据将全部永久删除（不可恢复）\n线下本地数据不受影响`;
          })
        "
      />
    </van-cell-group>
    <van-cell-group inset class="cells">
      <van-cell
        title="使用说明"
        icon="notes-o"
        is-link
        clickable
        @click="isShowDoc = true"
      />
      <van-cell
        title="导入信息"
        label="文件导入助记信息"
        icon="/images/import.png"
        clickable
        @click="isImport = true"
      >
      </van-cell>
      <van-cell
        title="导出信息"
        label="导出助记信息"
        icon="/images/export.png"
        clickable
        @click="checkExport"
      />
    </van-cell-group>
  </div>

  <van-overlay :show="isShowDoc">
    <div class="wrapper" @click="isShowDoc = false">
      <div class="docInfo" @click.stop>
        <div class="parts">搜索功能：</div>
        <ul class="desc">
          <li>直接输入关键词按标题搜索</li>
          <li>在搜索内容前面加上字符#按标签搜索</li>
          <li>输入正则表达式按标题搜索</li>
        </ul>
        <div class="parts">公开与收藏：（需要登录）</div>
        <ul class="desc">
          <li>在主页点击助记信息旁的公开按钮可公开该信息</li>
          <li>在发现页可以看到其他人公开的信息，点击收藏按钮可以将该信息添加到自己的信息库中</li>
        </ul>
        <div class="parts">导入与导出：</div>

        <ul class="desc">
          <li>在我的界面，点击导入，选择要导入的json文件，便可以将所选的所有文件的助记信息导入到自己的信息库中</li>
          <li>点击导出便可将本地的助记信息导出为json文件</li>
        </ul>
      </div>
    </div>
  </van-overlay>

  <van-overlay :show="isChangePwd">
    <div class="wrapper" @click="isChangePwd = false">
      <van-form @submit="onSubmit" @click.stop>
        <van-cell-group inset>
          <van-field
            v-model="user.password"
            type="password"
            name="旧密码"
            label="旧密码"
            placeholder="旧密码"
            :rules="[{ required: true, message: '请填写旧密码' }]"
            clearable
            :error-message="errMsg.pwdErr"
          />
          <van-field
            v-model="user.newPassword"
            type="password"
            name="新密码"
            label="新密码"
            placeholder="新密码"
            :rules="[{ required: true, message: '请填写新密码' }]"
            clearable
            :error-message="errMsg.newPwdErr"
          />
        </van-cell-group>
        <div style="margin: 16px">
          <van-button round block native-type="submit" class="bottom-button">
            修改
          </van-button>
        </div>
      </van-form>
    </div>
  </van-overlay>

  <van-overlay :show="deleteInfo.isdeleteUser">
    <div class="wrapper" @click="deleteInfo.isdeleteUser = false">
      <van-form @submit="deleteUser" @click.stop>
        <van-cell-group inset>
          <div class="confirmDelete">输入账号密码确认注销</div>
          <van-field
            v-model="deleteInfo.password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
            clearable
            :error-message="deleteInfo.err"
          />
        </van-cell-group>
        <div style="margin: 16px">
          <van-button
            round
            block
            native-type="submit"
            class="bottom-button"
            color="red"
          >
            注销账号
          </van-button>
        </div>
      </van-form>
    </div>
  </van-overlay>

  <van-overlay :show="isImport">
    <div class="wrapper" @click="isImport = false">
      <van-uploader
        :before-read="beforeRead"
        :after-read="afterRead"
        @click.stop
        accept=".json"
        v-model="fileList"
        multiple
      >
        <van-button
          round
          @click.stop="(isImport = false), (fileList = [])"
          class="operate"
          >取消</van-button
        >
        <van-button type="primary" round>选择文件</van-button>
        <van-button
          type="primary"
          round
          :disabled="canImport && !fileList.length"
          @click.stop="importData"
          class="operate"
          >一键导入</van-button
        >
      </van-uploader>
    </div>
  </van-overlay>
  <van-overlay :show="exportInfo.showExport">
    <my-dialog
      :show="exportInfo.showExport"
      :title="exportInfo.title"
      @confirm="confirm"
      @cancel="cancel"
    >
      <a class="a-export" :href="exportHref" ref="exportFile">确定</a>
    </my-dialog>
  </van-overlay>

  <van-overlay :show="operateUser.isShow">
    <my-dialog
      :show="operateUser.isShow"
      :title="operateUser.title"
      @confirm="operate"
      @cancel="cancel"
    >
    </my-dialog>
  </van-overlay>

  <van-notify
    v-model:show="noteInfo.showNote"
    background="var(--van-primary-color)"
  >
    {{ noteInfo.currentMessage }}
  </van-notify>
</template>
<style scoped lang="less">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  width: 100vw;
  height: calc(100vh - 50px);
  // background-color: lighten(#1989fa,30%);
  background: radial-gradient(
    circle at 75px 40px,
    lighten(#1989fa, 45%),
    var(--van-primary-color)
  );
}
.a-export {
  display: block;
  width: 100%;
  height: 100%;
  color: var(--van-primary-color);
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 50px);
  .docInfo {
    width: 75%;
    padding: 10px 10px 20px;
    background-color: #fff;
    border-radius: 20px;
    .parts {
      font-size: 20px;
      margin: 10px 0;
      color: var(--van-primary-color);
      font-weight: bold;
    }
  }
  .van-uploader {
    position: relative;
    width: 80%;
    :deep(.van-uploader__wrapper) {
      justify-content: space-around;
      max-height: 40vh;
      overflow: scroll;
      margin-bottom: 44px;
      .van-uploader__input-wrapper {
        display: flex;
        justify-content: space-around;
        position: absolute;
        bottom: 0;
        width: 100%;
        .van-button {
          width: 30%;
        }
        .operate {
          z-index: 10;
        }
      }
      .van-uploader__preview {
        display: inline-block;
        width: 30%;
        margin: 0 0 10px;
        .van-uploader__file {
          width: 100%;
          height: 44px;
          border-radius: 20px;
          .van-cell {
            border-radius: 20px;
          }
        }
      }
    }
  }
}
.cells {
  width: 85%;
}
.van-form {
  width: 90%;
  .bottom-button {
    background-color: var(--van-primary-color);
    color: #fff;
    border: 0;
  }
}
.confirmDelete {
  background-color: #fff;
  text-align: center;
  padding: 10px 0;
  margin: 0 5%;
  border-bottom: 1px solid var(--van-primary-color);
}
</style>
<script lang="ts">
import { defineComponent } from "vue";
import { Cell, CellGroup, Uploader, Form, Field } from "vant";
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
interface hasFile {
  file: File;
}
export default defineComponent({
  data() {
    return {
      isShowDoc: false,
      isChangePwd: false,
      operateUser: {
        isShow: false,
        optype: "",
        title: "",
      },
      deleteInfo: {
        isdeleteUser: false,
        password: "",
        err: "",
      },
      isImport: false,
      canImport: true,
      fileList: [],
      infoDataArr: [] as Array<Info>,
      exportInfo: {
        showExport: false,
        title: "",
      },
      noteInfo: {
        showNote: false,
        currentMessage: "",
      },
      exportHref: "javascript:;",
      user: {
        name: "",
        password: "",
        newPassword: "",
      },
      errMsg: {
        pwdErr: "",
        newPwdErr: "",
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
    clearStorage() {
      localStorage.removeItem("mh-token");
      localStorage.removeItem("mh-userName");
      this.$token = null;
      this.user.name = "";
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
    switchUser() {
      this.clearStorage();
      setTimeout(() => {
        this.$router.replace({ name: "login", params: { from: "/me" } });
      }, 1000);
    },
    exitUser() {
      this.clearStorage();
      this.showToast("退出账号成功！");
    },
    deleteUser() {
      this.$axios
        .delete("/auth/user/deleteUser", {
          data: {
            name: this.user.name,
            password: this.deleteInfo.password,
          },
        })
        .then((res) => {
          if (res.data.status == 200) {
            this.showToast(res.data.message);
            this.deleteInfo.isdeleteUser = false;
            this.clearStorage();
          } else {
            this.deleteInfo.err = res.data.message;
          }
        })
        .catch((e) => console.log(e));
    },
    operate() {
      this.operateUser.isShow = false;
      switch (this.operateUser.optype) {
        case "switch":
          return this.switchUser();
        case "exit":
          return this.exitUser();
        case "delete":
          return (this.deleteInfo.isdeleteUser = true);
        default:
          return;
      }
    },
    beforeRead(res: any) {
      if (res.type !== "application/json") {
        console.log("文件格式不对！");
        return false;
      }
      this.canImport = false;
      return true;
    },
    afterRead() {
      this.canImport = true;
    },
    async importData() {
      this.infoDataArr = [];
      if (this.fileList.length) {
        const readFileAsync = (file: File) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve(
                JSON.parse(reader.result as string).map((item: Info) => {
                  item._id = this.$nanoid(10);
                  item.createdTime = new Date().getTime();
                  return item;
                })
              );
            reader.readAsText(file);
          });
        for (let i = 0; i < this.fileList.length; i++) {
          this.infoDataArr = [
            ...this.infoDataArr,
            ...((await readFileAsync(
              (this.fileList[i] as hasFile).file
            )) as Info[]),
          ];
        }
        this.infoDataArr.forEach((item) => {
          this.$localforage
            .setItem(item._id, { ...item })
            .catch((e) => console.log(e));
        });
        this.showToast("导入成功");
      }
      this.isImport = false;
      this.fileList = [];
    },
    checkExport() {
      let arr: Array<Info> = [];
      this.$localforage
        .iterate((item) => {
          arr.push(item as Info);
        })
        .then(() => {
          this.infoDataArr = arr.sort((a, b) => b.createdTime - a.createdTime);
        })
        .then(() => {
          this.exportInfo.showExport = true;
          this.exportInfo.title = "确定要导出当前所有助记信息吗？";
        })
        .catch((e) => {
          console.log(e);
        });
    },
    confirm() {
      let a = this.$refs.exportFile as HTMLAnchorElement;
      a.download = `${this.$nanoid()}.json`;
      this.exportHref = URL.createObjectURL(
        new Blob([JSON.stringify(this.infoDataArr)])
      );
      this.showToast("导出成功");
    },
    cancel() {
      this.exportInfo.showExport = this.operateUser.isShow = false;
    },
    onSubmit() {
      this.errMsg.newPwdErr = this.errMsg.pwdErr = "";
      if (this.user.newPassword === this.user.password) {
        this.errMsg.newPwdErr = "新密码不能与旧密码相同！";
        return;
      }
      this.$axios
        .put("/auth/user/changeUserPwd", this.user)
        .then((res) => {
          if (res.data.status == 200) {
            this.showToast(res.data.message);
            this.user.newPassword = this.user.password = "";
          } else {
            this.errMsg.pwdErr = res.data.message;
          }
        })
        .catch((e) => console.log(e));
    },
  },
  activated() {
    this.infoDataArr = [];
    this.$token = localStorage.getItem("mh-token");

    if (this.$token)
      this.user.name = localStorage.getItem("mh-userName") as string;
  },
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Uploader.name]: Uploader,
    [Form.name]: Form,
    [Field.name]: Field,
    MyDialog,
  },
});
</script>
