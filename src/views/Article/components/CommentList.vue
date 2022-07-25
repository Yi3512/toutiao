<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :AddList="AddList"
    >
      <van-cell v-for="item in AddList" :key="item.art_id">
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px"
          :src="item.aut_photo"
        />
        <span style="color: #466b9d" slot="title">{{ item.aut_name }}</span>
        <div slot="label">
          <p style="color: #363636">{{ item.content }}</p>
          <p>
            <!-- 时间 -->
            <span style="margin-right: 10px">{{ ArticleTime(item) }}</span>
            <!-- 回复 -->
            <van-button
              @click="showPopup"
              class="like-btn"
              round
              size="mini"
              type="default"
              ><span>回复</span
              ><span class="btn-right">{{ item.reply_count }}</span>
            </van-button>
          </p>
          <!-- 评论回复 -->
          <van-popup
            :closeable="false"
            v-model="show"
            position="bottom"
            style="height: 95%"
          >
            <CommentItem
              :source="source"
              :commentreply="item"
              @addreply="addreply(item)"
            />
          </van-popup>
          <!-- /评论回复 -->
        </div>
        <!-- 点赞 -->
        <van-button
          v-if="item.like_count === 0"
          class="like-btn"
          icon="good-job-o"
          @click="onLikings(item)"
        >
          赞
        </van-button>

        <van-button
          v-else
          class="like-btn"
          :class="{ liked: item.is_liking }"
          :icon="item.is_liking ? 'good-job' : 'good-job-o'"
          @click="onLikings(item)"
        >
          {{ item.like_count }}
        </van-button>
      </van-cell>
    </van-list>
    <!-- 评论列表 -->
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
import CommentItem from './CommentItem.vue'
import { getComments, CommentLikings, noCommentLikings } from '@/api'
export default {
  name: 'ArticleComment',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    AddList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      show: false, // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null, // 请求下一页数据的页码
      totalCount: 0, // 总数据条数
      limit: 10 // 评论数据个数
    }
  },
  created () {
    this.onLoad()
  },
  methods: {
    addreply (item) {
      console.log(item, 9999)
      item.reply_count++
    },
    showPopup () {
      this.show = true
    },
    // 获取评论数据
    async onLoad () {
      const { data } = await getComments({
        type: 'a',
        source: this.source,
        offset: this.offset,
        limit: this.limit
      })
      const results = data.data.results
      //  将数据添加到列表中
      // this.AddList
      this.$parent.AddList.push(...results)
      // 更新总数据条数
      this.$emit('istotalCount', data.data)
      // 加载状态结束
      this.loading = false

      // 判断是否还有数据
      if (results.length) {
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    },
    // 点赞
    async onLikings (item) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      try {
        if (!item.is_liking) {
          await CommentLikings(item.com_id)
          item.is_liking = !item.is_liking
          item.like_count++
        } else {
          await noCommentLikings(item.com_id)
          item.is_liking = !item.is_liking
          item.like_count--
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 时间
    ArticleTime (item) {
      const relativeTime = dayjs(item.pubdate).fromNow()
      return relativeTime
    }
  }
}
</script>

<style scoped lang="less">
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
.button {
  width: 1.8rem;
  .btn-right {
    margin-left: 5px;
  }
}
.like-btn {
  border: none;
  span {
    margin-left: 0.10667rem;
    font-size: 0.25333rem;
  }
}
.liked {
  color: red;
}
</style>
