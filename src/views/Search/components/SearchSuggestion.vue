<template>
  <div>
    <van-cell v-for="(item, index) in highlightData" :key="index" :title="item">
      <template #icon>
        <van-icon name="search" class="search-icon" />
      </template>

      <template #title>
        <span v-html="item"></span>
      </template>
    </van-cell>
    SearchSuggerstion
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api'
export default {
  name: 'SearchSuggestion',
  props: {
    keywords: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestion: []
    }
  },
  methods: {
    async getSearchSuggestion () {
      try {
        const res = await getSearchSuggestions(this.keywords)
        // console.log(res)
        if (res.data.data.options.length === 0) {
          this.$toast.fail('没有搜索建议')
        }
        this.suggestion = res.data.data.options.filter(Boolean)
        console.log(this.suggestion)
      } catch (e) {
        console.log(e)
      }
    }
  },
  watch: {
    keywords: {
      immediate: true,
      handler () {
        this.getSearchSuggestion()
      }
    }
  },
  computed: {
    highlightData () {
      const reg = new RegExp(this.keywords, 'ig')
      return this.suggestion.map((str) =>
        str.replace(reg, (match) => `<span style="color:red">${match}</span>`)
      )
    }
  }
}
</script>

<style lang="less" scoped>
.search-icon {
  padding-top: 10px;
}
</style>
