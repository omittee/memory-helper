<template>
  <div class="wrapper">
    <div class="container" @click.stop>
      <div class="content">{{ title }}</div>
      <div class="footer">
        <div class="cancel" @click="onCancel">取消</div>
        <div class="confirm" @click="onConfirm"><slot>确定</slot></div>
      </div>
    </div>
  </div>
</template>
<style lang="less">
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  .container {
    width: 80%;
    height: auto;
    background-color: #fff;
    border-radius: 12px;
    padding: 0 10px;
    z-index: 999;
    .content {
      height: 30%;
      text-align: center;
      padding: 20px;
      margin: 0;
      border-bottom: 1px solid var(--van-primary-color);
    }
    .footer {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      .confirm,
      .cancel {
        width: 45%;
        height: 100%;
        padding: 10px;
        margin: 2px 0;
        text-align: center;
      }
      .cancel {
        border-right: 1px solid #ccc;
      }
      .confirm {
        border-left: 1px solid #ccc;
        color: var(--van-primary-color);
      }
      .confirm:active,
      .cancel:active {
        background-color: #eee;
      }
    }
  }
}
</style>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    show: Boolean,
    title: String,
  },
  methods: {
    onConfirm() {
      this.$emit("confirm");
    },
    onCancel() {
      this.$emit("cancel");
    },
  },
});
</script>
