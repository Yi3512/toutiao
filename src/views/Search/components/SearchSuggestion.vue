<template>
  <div>
    <van-cell
      v-for="(item, index) in highlightData"
      :key="index"
      @click="searchFn(index)"
    >
      <template #icon>
        <van-icon name="search" class="search-icon" />
      </template>

      <template #title>
        <span v-html="item"></span>
      </template>
    </van-cell>
  </div>
</template>

<script>
// 引入API
import { getSearchSuggestion } from '@/api'
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  props: {
    // 搜索关键词
    keywords: {
      type: String,
      required: true
    }
  },
  handler: debounce((val) => {
    this.getSearchSuggestion(val)
  }, 200),
  data () {
    return {
      suggestions: []
    }
  },
  watch: {
    // 监视属性绑定的函数
    keywords: {
      // 立即执行
      immediate: true,
      handler () {
        this.getSearchSuggestion()
      }
    }
  },
  methods: {
    searchFn (index) {
      this.$emit('search', this.suggestions[index])
    },
    // 获取搜索建议, 并处理数据
    async getSearchSuggestion () {
      try {
        const res = await getSearchSuggestion(this.keywords)
        console.log(res)
        this.suggestions = res.data.data.options.filter(Boolean)

        if (this.suggestions.length === 0) {
          this.$toast.fail('没有搜索建议')
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  computed: {
    highlightData () {
      // 将搜索建议的每一项处理 new RegExp正则表达式构造函数
      const reg = new RegExp(this.keywords, 'ig')

      return this.suggestions.map((str) =>
        str.replace(reg, (match) => `<span style="color:red">${match}</span>`)
      )
    }
  }
}
</script>

<style scoped lang="less">
.search-icon {
  padding-top: 10px;
}
</style>
