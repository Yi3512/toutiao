<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      title="编辑昵称"
      left-text="取消"
      right-text="确定"
      @click-right="onClickRight"
      @click-left="$emit('close')"
    />
    <!-- /导航栏 -->
    <div style="padding: 10px">
      <!-- 输入框 -->
      <van-field
        v-model="localNmae"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入新昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserName } from '@/api'
export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // 现在的名字
      message: this.value,
      // 用来装新名字
      localNmae: ''
    }
  },
  methods: {
    async onClickRight () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })
      try {
        // 如果新输入的名字为空 提示用户
        if (this.localNmae.trim() === '') return this.$toast('请输入昵称')
        // 修改姓名数据
        await updateUserName({
          name: this.localNmae
        })
        // 通过input传去给父组件的v-model实现 动态更新父子组件的数据
        this.$emit('input', this.localNmae)
        // 调用改变弹窗
        this.$emit('close')
        this.$toast('更新成功')
      } catch (err) {
        console.dir(err)
        if (err.response && err.response.status === 409) {
          return this.$toast.success('用户名已存在')
        }
        this.$toast('更新失败')
      }
    }
  },
  created () {
    this.localNmae = this.value
  }
}
</script>

<style lang="less" scoped>
.van-popup {
  background: #f5f7f9;
}
</style>
