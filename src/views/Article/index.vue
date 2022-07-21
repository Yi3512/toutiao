<template>
  <div>123</div>
</template>

<script>
import { getArticleDetail } from '@/api'
export default {
  created () {
    this.onLad()
  },
  methods: {
    onLad () {
      const res = getArticleDetail(8128)

      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped></style>
