<template>
  <div>
    <!-- 头部导航 -->
    <van-nav-bar class="navbar" title="登录" @click-left="onClickLeft">
      <template #left>
        <van-icon name="cross" />
      </template>
    </van-nav-bar>
    <!-- 手机号/验证码表单 -->
    <van-form ref="form" class="form" @submit="login">
      <van-field
        v-model="mobile"
        type="number"
        name="mobile"
        placeholder="请输入手机号"
        :rules="mobileRules"
      >
        <template #label>
          <span class="toutiao toutiao-shouji"></span>
        </template>
      </van-field>
      <van-field
        v-model="code"
        name="code"
        placeholder="请输入验证码"
        :rules="codeRules"
      >
        <template #label>
          <span class="toutiao toutiao-yanzhengma"></span>
        </template>
        <template #right-icon>
          <van-count-down
            v-if="isShowCountDown"
            :time="3 * 1000"
            @finish="finish"
          />
          <van-button
            v-else
            class="code-btn"
            round
            size="mini"
            @click="sendCode"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <!-- 登录按钮 -->
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit" >登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendCode } from '@/api/user'
import { mobileRules, codeRules } from './rules'
export default {
  data () {
    return {
      mobile: '',
      code: '',
      mobileRules,
      codeRules,
      isShowCountDown: false
    }
  },
  methods: {
    onClickLeft () {
      this.$router.back()
    },
    async login () {
      this.$toast.loading({
        message: '加载中',
        forbidClick: true
      })
      try {
        const res = await login(this.mobile, this.code)
        this.$store.commit('setUser', res.data.data)
        console.log(res)
        this.$router.push('/profile')
        this.$toast.success('登录成功')
      } catch (error) {
        const status = error.response.status
        let message = '登录错误，请稍后重试'
        if (status === 400) {
          message = error.response.data.message
          // switch (status) {
          //   case 400:
          //     this.$toast.fail(error.response.data.message)
          //     break
          //   default:
          //     this.$toast.fail('登录错误，请稍后重试')
          //     break
          // }
        }
        this.$toast.fail(message)
      }
    },

    async sendCode () {
      try {
        await this.$refs.form.validate('mobile')
        await sendCode(this.mobile)
        this.isShowCountDown = true
      } catch (error) {
        if (!error.response) {
          this.$toast.fail('手机号格式不正确')
        } else {
          const status = error.response.status
          if (status === 404 || status === 429) {
            this.$toast.fail(error.response.data.message)
          }
        }
      }
    },
    finish () {
      this.isShowCountDown = false
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
