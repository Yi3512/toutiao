<template>
  <div>
    <van-pull-refresh  v-model="refreshLoading" @refresh='onLoad' success-text="刷新成功" >
          <van-list
      @load="onLoad"
      offset="1"
      :immediate-check="false"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了~~~"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
    >
      <article-item
        v-for="item in articles"
        :key="item.art_id"
        :articlesInfo="item"
      ></article-item>
    </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api'
import ArticleItem from './ArticleItem'
export default {
  components: { ArticleItem },
  data () {
    return {
      articles: [],
      pre_timestamp: '',
      loading: false,
      finished: false,
      error: false,
      refreshLoading: false
    }
  },
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  created () {
    this.getArticles()
  },
  methods: {
    async getArticles () {
      try {
        const { data } = await getArticles(this.id, +new Date())
        // console.log(data)
        this.pre_timestamp = data.data.pre_timestamp
        this.articles = data.data.results
      } catch (error) {
        const status = error.response.status
        if (status === 400) {
          throw new Error(error.response.data.message)
        } else {
          this.$toast.fail('获取文章列表失败，请刷新')
        }
      }
    },
    async onLoad () {
      try {
        /* if (Math.random() < 0.7) {
          throw new Error('测试错误')
        } */
        const { data } = await getArticles(this.id, this.pre_timestamp)
        // console.log(data)
        if (!data.data.pre_timestamp) {
          this.finished = true
        }
        if (this.refreshLoading) {
          this.articles.unshift(...data.data.results)
        } else {
          this.articles.push(...data.data.results)
        }
        this.articles.push(...data.data.results)
        this.pre_timestamp = data.data.pre_timestamp
      } catch (error) {
        this.error = true
      } finally {
        this.loading = false
        this.refreshLoading = false
      }
    }
  }
}
</script>

<style></style>
