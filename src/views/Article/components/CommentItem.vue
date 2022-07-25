<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar :title="`${commentreply.reply_count}条回复`"> </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 当前评论项 -->
    <div class="current">
      <div>
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px"
          :src="commentreply.aut_photo"
        />
      </div>
      <div>
        <span style="color: #466b9d" slot="title">{{
          commentreply.aut_name
        }}</span>
        <div slot="label">
          <p style="color: #363636">{{ commentreply.content }}</p>
          <p>
            <!-- 时间 -->
            <span style="margin-right: 10px">{{
              ArticleTime(commentreply)
            }}</span>
            <!-- 回复 -->
            <van-button class="com-btn" round size="mini" type="default"
              ><span>回复</span
              ><span class="btn-right">{{ commentreply.reply_count }}</span>
            </van-button>
          </p>
        </div>
      </div>
      <div>
        <!-- 点赞 -->
        <van-button
          v-if="commentreply.like_count === 0"
          class="like-btn"
          icon="good-job-o"
          @click="onLikings(commentreply)"
        >
          赞
        </van-button>

        <van-button
          v-else
          class="like-btn"
          :class="{ liked: commentreply.is_liking }"
          :icon="commentreply.is_liking ? 'good-job' : 'good-job-o'"
          @click="onLikings(commentreply)"
        >
          {{ commentreply.like_count }}
        </van-button>
      </div>
    </div>

    <!-- /当前评论项 -->

    <van-cell title="所有回复" />

    <!-- 评论的回复列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="item in Commentsreplylist" :key="item.art_id">
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px"
          :src="item.aut_photo"
        />
        <span style="color: #1e1e1e" slot="title">{{ item.aut_name }}</span>
        <div slot="label">
          <p style="color: #363636">{{ item.content }}</p>
          <p>
            <!-- 时间 -->
            <span style="margin-right: 10px">{{ ArticleTime(item) }}</span>
            <!-- 回复 -->
            <van-button class="like-btn" round size="mini" type="default"
              ><span>回复</span
              ><span class="btn-right">{{ item.reply_count }}</span>
            </van-button>
          </p>
        </div>
        <div>
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
        </div>
      </van-cell>
    </van-list>
    <!-- /评论的回复列表 -->

    <!-- 底部 -->
    <div class="commentbtn">
      <van-button @click="showPopup" round type="primary" size="large"
        >评论</van-button
      >
    </div>
    <!-- 弹出 -->
    <van-popup
      class="popup-btn"
      v-model="show"
      position="bottom"
      :style="{ height: '15%' }"
      ><van-field
        style="background-color: #f5f7f9"
        v-model.trim="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="50"
        placeholder="请输入留言"
        show-word-limit
      /><van-button
        @click="onAddComment"
        type="primary"
        color="#3296fa"
        plain
        :disabled="!message.length"
        >发布</van-button
      >
    </van-popup>
    <!-- /底部 -->
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
import {
  getComments,
  addComment,
  CommentLikings,
  noCommentLikings
} from '@/api'
export default {
  data () {
    return {
      // 当前评论数据
      Commentsreplylist: [],
      show: false,
      message: '',
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null, // 请求下一页数据的页码
      totalCount: 0, // 总数据条数
      limit: 10 // 评论数据个数
    }
  },
  props: {
    commentreply: {
      type: Object
    },
    source: {
      type: [Number, String, Object]
    }
  },
  created () {
    // this.onLoad()
  },
  methods: {
    showPopup () {
      this.show = true
    },
    // 获取评论数据
    async onLoad () {
      const { data } = await getComments({
        type: 'c',
        source: this.commentreply.com_id,
        offset: this.offset,
        limit: this.limit
      })
      //  将数据添加到列表中
      const results = data.data.results
      this.Commentsreplylist.push(...results)
      console.log(this.Commentsreplylist)

      // 加载状态结束
      this.loading = false

      // 判断是否还有数据
      if (results.length) {
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    },
    // 发布评论
    async onAddComment () {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true,
        duation: 0
      })
      console.log(this.source, 777)
      const { data } = await addComment({
        target: this.commentreply.com_id, // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
        content: this.message, // 评论内容
        art_id: this.source
      })
      console.log(data, 123)
      this.Commentsreplylist.unshift(data.data.new_obj)
      this.$emit('addreply', this.Commentsreplylist)
      // console.log(this.AddList, 555555)
      this.message = ''
      this.show = false
      // console.log(data)
    },
    // 时间
    ArticleTime (item) {
      const relativeTime = dayjs(item.pubdate).fromNow()
      return relativeTime
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
    }
  }
}
</script>

<style lang="less" scoped>
.current {
  display: flex;
  align-items: flex-start;
}
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
.com-btn {
  width: 1.8rem;
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
// 发布按钮
.commentbtn {
  width: 100%;
  height: 1.33333rem;
  position: fixed;
  bottom: 0;
  border-top: 0.01333rem solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ff69b4;
  border: none;
  .van-button--primary {
    color: #1e1e1e;
    background-color: #ffffff;
    border: none;
  }
  .van-button--large {
    width: 85%;
    height: 80%;
  }
}
.popup-btn {
  display: flex;
  align-items: center;
  padding: 0.42667rem 0 0.42667rem 0.42667rem;
  .van-cell {
    width: 80%;
  }
  .van-button--normal {
    border: none;
  }
}
</style>
