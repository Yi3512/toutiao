<template>
  <div>
    <!-- 头部导航 -->
    <van-nav-bar class="navbar" title="登录" @click-left="backToPrePage">
      <template #left>
        <van-icon name="cross" />
      </template>
    </van-nav-bar>

    <!-- 手机号/验证码表单 -->
    <van-form ref="form" class="form" @submit="login">
      <van-field
        v-model="mobile"
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
        type="text"
        name="code"
        placeholder="请输入验证码"
        :rules="codeRules"
      >
        <!-- 左侧字体图标 -->
        <template #label>
          <span class="toutiao toutiao-yanzhengma"></span>
        </template>

        <!-- 右侧验证码图标 -->
        <template #right-icon>
          <!-- 验证码倒计时 -->
          <van-count-down
            v-if="isShowCountDown"
            :time="3 * 1000"
            @finish="isShowCountDown = false"
          />
          <!-- 发送验证码图标 -->
          <van-button
            v-else
            class="code-btn"
            size="mini"
            round
            @click="sendCode"
            native-type="button"
            >发送验证码</van-button
          >
        </template>
      </van-field>

      <!-- 登录按钮 -->
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
    <!-- 登录按钮 -->
  </div>
</template>

<script>

// 引入api
import { login, sendCode } from '@/api/user'
// 引入校验规则
import { mobileRules, codeRules } from './rules'
export default {
  name: 'Login',
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
    // 返回来之前的页面
    backToPrePage () {
      this.$router.back()
    },
    // 登录
    async login () {
      // loading
      this.$toast.loading({
        message: '不要着急.加载中..',
        // loading时, 禁止点击页面
        forbidClick: true
      })

      try {
        const res = await login(this.mobile, this.code)
        // 存储token
        this.$store.commit('setUser', res.data.data)
        // 跳转页面
        this.$router.push('/profile')
        // 提示成功
        this.$toast.success('登录成功')
      } catch (error) {
        // 拿到后端状态码
        const status = error.response.status
        // 失败消息
        let message = '登录错误, 请刷新~'

        if (status === 400) {
          // 如果是400, 使用服务器提供的消息
          message = error.response.data.message
        }

        this.$toast.fail(message)
      }
    },
    // 发送验证码
    async sendCode () {
      try {
        // 验证手机号
        await this.$refs.form.validate('mobile')
        // 发送请求, 获取验证码
        await sendCode(this.mobile)
        // 显示倒计时
        this.isShowCountDown = true
      } catch (error) {
        // 1. 表单校验失败
        if (!error.response) {
          this.$toast.fail('手机号格式不正确')
        } else {
          // 2. 发送验证码导致的失败
          const status = error.response.status
          if (status === 404 || status === 429) {
            this.$toast.fail(error.response.data.message)
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.navbar {
  background-color: #3296fa;

  :deep(.van-nav-bar__title) {
    color: #fff;
  }

  .van-icon {
    color: #fff;
  }
}

// 表单域样式
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
    padding: 0 10px;
    color: #666;
  }
}
</style>
