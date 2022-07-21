<template>
  <div>
    <!-- 头部搜索框 -->
    <form action="/">
      <van-search
        v-model="keywords"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="backToPrePage"
        @focus="visibleSearchSuggestion"
        background="#3296fa"
        class="search"
      />
    </form>

    <!-- 搜索历史/建议/结果 -->
    <component
      :is="componentName"
      :keywords="keywords"
      @search="onSearch"
      :searchHistorlist="searchHistorlist"
      @delAll="delall"
      @delFn="delFn"
    ></component>
  </div>
</template>

<script>
// 引入组件
import SearchHistory from './components/SearchHistory.vue'
import SearchResult from './components/SearchResult.vue'
import SearchSuggestion from './components/SearchSuggestion.vue'
export default {
  name: 'Search',
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion
  },
  data () {
    return {
      // 搜索关键词
      keywords: '',
      isShowSearchResult: false,
      searchHistorlist: this.$store.state.History
    }
  },
  computed: {
    componentName () {
      // 搜索结果: 搜索框没有值或者是空字符串
      // 搜索结果: isShowSearchResult=ture
      if (this.keywords.trim() === '') {
        return 'SearchHistory'
      }

      if (this.isShowSearchResult) {
        return 'SearchResult'
      }

      return 'SearchSuggestion'
    }
  },
  methods: {
    // 删除全部记录
    delall () {
      this.searchHistorlist = []
      this.$store.commit('setSearchHistory', this.searchHistorlist)
    },
    // 删除选中记录
    delFn (index) {
      this.searchHistorlist.splice(index, 1)
      this.$store.commit('setSearchHistory', this.searchHistorlist)
    },
    // 搜索
    onSearch (item) {
      // item 为当前搜索的值
      this.keywords = item
      console.log(item)
      console.log('正在搜索')
      //  去历史记录数组里找当前的字符串 有为0 没有值为-1
      const index = this.searchHistorlist.indexOf(item)
      console.log(index)
      if (index !== -1) {
        // 当index不是-1时 删除当前index内容 去重
        this.searchHistorlist.splice(index, 1)
      }
      // 把item添加到数组第一位置
      this.searchHistorlist.unshift(item)
      console.log(this.searchHistorlist)
      // 存储到本地
      this.$store.commit('setSearchHistory', this.searchHistorlist)
      // 显示搜索结果
      this.isShowSearchResult = true
    },
    // 返回上一页
    backToPrePage () {
      this.$router.go(-1)
    },
    // 显示搜索建议
    visibleSearchSuggestion () {
      // 如果keywords没有值 显示搜索历史
      // 如果keywords有值 显示搜索建议
      this.isShowSearchResult = false
    }
  }
}
</script>

<style scoped lang="less">
.search {
  [role='button'] {
    color: #fff;
  }
}
</style>
