<template>
  <div>
    <!-- 头部导航 -->
    <van-nav-bar class="navbar" title="登录" @click-left="onClickLeft">
      <template #left>
        <van-icon name="cross" />
      </template>
    </van-nav-bar>
    <!-- 手机号/验证码表单 -->
    <van-form class="form" @submit="login">
      <van-field
        v-model="mobile"
        type="number"
        name="mobile"
        placeholder="请输入手机号"
        :rules="[
          { required: true, message: '请输入正确的手机号' }
        ]"
      >
        <template #label>
          <span class="toutiao toutiao-shouji"></span>
        </template>
      </van-field>
      <van-field
        v-model="code"
        name="code"
        placeholder="请输入验证码"
        :rules="[
          { required: true, message: '请输入正确的验证码'}
        ]"
      >
        <template #label>
          <span class="toutiao toutiao-yanzhengma"></span>
        </template>
        <template #right-icon>
          <van-button class="code-btn" round size="mini">发送验证码</van-button>
        </template>
      </van-field>
      <!-- 登录按钮 -->
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  data () {
    return {
      mobile: '',
      code: ''
    }
  },
  methods: {
    onClickLeft () {
      this.$router.back()
    },
    async login () {
      const res = await login(this.mobile, this.code)
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
  background-color: #6fb3fa;
  :deep(.van-nav-bar__title) {
    color: #fff;
  }
  .van-icon {
    color: #fff;
  }
}
.form {
  :deep(.van-field__label) {
    flex: 1;
  }
  :deep(.van-cell__value) {
    flex: 20;
  }
  .toutiao {
    font-size: 0.49333rem;
  }
  .code-btn {
    background-color: #eee;
    padding: 0 15px;
    color: #666;
  }
}
</style>
