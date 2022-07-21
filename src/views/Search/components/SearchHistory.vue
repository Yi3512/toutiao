<template>
  <div class="search-history">
    <van-cell title="搜索历史" class="history-title">
      <span v-show="isShow" class="delall" @click="delAll">全部删除</span>
      <span v-show="isShow" class="complete" @click="isShow = !isShow"
        >完成</span
      >
      <van-icon name="delete" v-show="!isShow" @click="isShow = !isShow" />
    </van-cell>
    <van-cell
      v-for="(item, index) in searchHistorlist"
      :key="index"
      :title="item+''"
      @click="delFn(index,item)"
    >
      <van-icon name="close"  v-show="isShow"/>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistorlist: {
      type: Array,
      require: true
    }
  },
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    // 删除记录
    delFn (index, item) {
      // 判断状态
      if (this.isShow) {
        this.$emit('delFn', index)
      } else {
        this.$emit('search', item)
      }
    },
    // 删除全部记录
    delAll () {
      this.$emit('delAll')
    }
  }
}
</script>

<style scoped lang="less">
.search-history {
  .history-title {
    .complete {
      margin-left: 7px;
    }
  }
}
</style>
