<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="item in list" :key="item.art_id">
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
            <van-popup v-model="show">内容</van-popup>
          </p>
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
          class="like-btn liked"
          icon="good-job"
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

import { getComments, CommentLikings, noCommentLikings } from '@/api'
export default {
  name: 'ArticleComment',
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      show: false,
      list: [], // 评论列表
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
      // console.log(data, '文章')
      const { results } = data.data
      //  将数据添加到列表中
      this.list.push(...results)
      // 更新总数据条数
      this.totalCount = data.data.total_count
      this.$emit('istotalCount', data.data)
      this.$emit('ListAdd', data.data)
      // console.log(data.data, 123)
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
      // console.log(id)
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
  span {
    margin-left: 0.10667rem;
    font-size: 0.25333rem;
  }
}
.liked {
  color: red;
}
.van-list {
  margin-bottom: 45px;
}
.avatar {
  width: 72px;
  height: 72px;
  margin-right: 25px;
}

.title-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .user-name {
    color: #406599;
    font-size: 26px;
  }
}

.comment-content {
  font-size: 32px;
  color: #222222;
  word-break: break-all;
  text-align: justify;
}

.comment-pubdate {
  font-size: 19px;
  color: #222;
  margin-right: 25px;
}

.bottom-info {
  display: flex;
  align-items: center;
}

.reply-btn {
  width: 135px;
  height: 48px;
  line-height: 48px;
  font-size: 21px;
  color: #222;
}

.like-btn {
  height: 30px;
  padding: 0;
  border: none;
  font-size: 19px;
  line-height: 30px;
  margin-right: 7px;

  .van-icon {
    font-size: 30px;
  }
}

.active {
  color: #fcc64b;
}
</style>
