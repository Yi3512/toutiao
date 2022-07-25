<template>
  <van-picker
    title="性别"
    show-toolbar
    :columns="columns"
    :default-index="value"
    @cancel="$emit('close')"
    @change="onChange"
    @confirm="onConfirm"
  />
  <!--default-index 通过单列默认索引 来判断男女 -->
</template>

<script>
import { updateUserName } from '@/api'
export default {
  // 用户性别 0 男 1 女
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      // vant组件 columns 自定义列表内容
      columns: ['男', '女'],
      gender: this.value
    }
  },
  methods: {
    // 当值发送变化触发事件
    onChange (picker, value, index) {
      this.gender = index
    },
    // 点击完成按钮时触发的事件
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })
      try {
        console.log(this.gender)
        // 修改性别数据 值为数字 0 或 1
        await updateUserName({
          gender: this.gender
        })
        // 通过input 给 父组件 同步更新值
        this.$emit('input', this.gender)
        // 关闭弹窗
        this.$emit('close')
        this.$toast.success('更新成功')
      } catch (err) {
        console.log(err)
        this.$toast('更新失败')
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
