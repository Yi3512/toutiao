<template>
  <div>
    <!-- 无图片 -->
    <van-cell
      v-if="articlesInfo.cover.type === 0"
      :title="articlesInfo.title"
      :label="articleDesc"
    ></van-cell>
    <!-- 渲染一张图片 -->
    <van-cell
      v-if="articlesInfo.cover.type === 1"
      :title="articlesInfo.title"
      :label="articleDesc"
    >
      <van-image
        width="3rem"
        height="2rem"
        :src="articlesInfo.cover.images[0]"
      />
    </van-cell>
    <!-- 渲染三张图片 -->
    <van-cell v-if="articlesInfo.cover.type === 3" :title="articlesInfo.title">
      <template #label>
        <div>
          <van-image
            v-for="item in articlesInfo.cover.images"
            :key="item"
            width="3rem"
            height="2rem"
            :src="item"
          />
        </div>
        <span> {{ articleDesc }}</span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
export default {
  data () {
    return {}
  },
  props: {
    articlesInfo: {
      type: Object,
      required: true
    }
  },
  computed: {
    articleDesc () {
      const val = this.articlesInfo
      const relativeTime = dayjs(val.pubdate).fromNow()
      return `${val.aut_name} ${val.comm_count}评论数 ${relativeTime}`
    }
  }
}
</script>

<style></style>
