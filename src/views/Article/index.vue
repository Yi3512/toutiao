<template>
  <div style="padding-top: 46px">
    <div v-if="articlelist.length === 0" class="loading-wrap">
      <van-loading color="#3296fa" vertical>加载中</van-loading>
    </div>
    <div v-else>
      <!-- 头部 -->
      <div class="box">
        <van-nav-bar
          class="article-title"
          title="黑马头条"
          left-arrow
          @click-left="onClickLeft"
        />
      </div>
      <!-- 主体内容 -->
      <div class="article-main">
        <!-- 标题 -->
        <div class="main-title">
          <h1>{{ articlelist.title }}</h1>
        </div>
        <!-- 作者信息 -->
        <div class="Userbox">
          <van-row type="flex" align="center" justify="space-between">
            <!-- 头像 -->
            <van-col span="2" class="imgbox"
              ><img :src="articlelist.aut_photo" alt="" />
            </van-col>
            <!-- 名称和时间 -->
            <van-col span="14" class="Userbox-user">
              <span class="Userbox-name">{{ articlelist.aut_name }}</span>
              <span class="Userbox-time">{{ this.ArticleTime() }}</span>
            </van-col>
            <!-- 关注按钮 -->
            <van-col span="6">
              <van-button
                class="Userbox-btn"
                round
                type="info"
                @click="onFollow"
              >
                <!-- <van-loading /> -->
                <div v-if="isLoading">
                  <van-loading size="25" color="#ffffff" />
                </div>
                <div v-else>
                  <p v-if="isFollow">已关注</p>
                  <p v-else><van-icon name="plus" />关注</p>
                </div>
              </van-button>
            </van-col>
          </van-row>
        </div>
        <!-- 文章内容 -->
        <div
          class="main-text article-content markdown-body"
          v-html="articlelist.content"
        ></div>
        <!-- 正文分隔线 -->
        <van-divider>正文结束</van-divider>
        <!-- 评论区 -->
        <div class="Comment">
          <div class="comment-img">
            <img :src="userList.photo" alt="" />
          </div>
          <div class="comment-main">
            <div class="comment-title">
              <h3>{{ userList.name }}</h3>
              <van-icon name="good-job-o"><span>赞</span></van-icon>
            </div>
            <p>内容</p>
            <span>时间</span>
            <span class="reply">回复 0</span>
          </div>
        </div>
        <div></div>
      </div>
      <!-- 底部区域 -->
      <div class="boxx">
        <div class="article-bottom">
          <van-button class="comment-btn" type="default" round size="small"
            >写评论</van-button
          >
          <!-- 当前评论数量 -->
          <van-icon name="comment-o" badge="0" color="#777" />
          <!-- 收藏 -->
          <van-icon
            :color="isCollections ? '#eb3941' : '#777'"
            :name="isCollections ? 'star' : 'star-o'"
            @click="onCollections"
          />
          <!-- 点赞 -->
          <van-icon
            :color="isLikings === 1 ? '#eb3941' : '#777'"
            :name="isLikings === 1 ? 'good-job' : 'good-job-o'"
            @click="onLikings"
          />
          <!-- 转发 -->
          <van-icon name="share" color="#777777"></van-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '../../assets/style/github-markdown.css'
import dayjs from '@/utils/dayjs'
import {
  getArticleDetail,
  getUserInfo,
  addUserFollowings,
  dleUserFollowings,
  AddCollections,
  DeleteCollections,
  AddLikings,
  DeleteLikings,
  AddDislikes,
  DeleteDislikes
} from '@/api'
export default {
  data () {
    return {
      // 用户
      isFollow: '',
      // 收藏
      isCollections: '',
      // 点赞
      isLikings: 0,
      // 本文章信息列表
      articleId: this.$store.state.AutId,
      // 获取文章详情
      articlelist: [],
      // 获取用户信息
      userList: [],
      // 加载
      isLoading: false
    }
  },
  created () {
    this.getArticleDetail()
    this.ArticleTime()
    this.getUserInfo()
    // console.log(this.articleId, '文章id')
  },
  methods: {
    // 判断是关注还是没关注
    async onFollow () {
      this.isLoading = true
      try {
        const autId = this.articleId.aut_id
        // console.log(autId)
        if (this.isFollow) {
          await dleUserFollowings(autId)
        } else {
          await addUserFollowings(autId)
        }
        this.isLoading = false
        this.isFollow = !this.isFollow
      } catch (e) {
        console.log(e)
        this.$toast.fail('操作失败')
      }
    },
    // 添加收藏还是删除收藏
    async onCollections () {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      try {
        const iscollected = this.articleId.art_id
        // console.log(iscollected, 123)
        if (this.isCollections) {
          await DeleteCollections(iscollected)
        } else {
          await AddCollections(iscollected)
        }
        this.isCollections = !this.isCollections
        this.$toast.loading({
          message: '加载中...',
          forbidClick: false
        })
        this.$toast.success(this.isCollections ? '收藏成功' : '取消收藏')
      } catch (e) {
        console.log(e)
        this.$toast.fail('操作失败')
      }
    },
    // 点赞
    async onLikings () {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      try {
        const islikings = this.articleId.art_id
        if (this.isLikings === 1) {
          await AddLikings(islikings)
          await AddDislikes(islikings)
          this.isLikings = -1
          this.$toast.success('取消点赞')
        } else {
          await DeleteLikings(islikings)
          await DeleteDislikes(islikings)
          this.isLikings = 1
          this.$toast.success('点赞成功')
        }
        this.$toast.loading({
          message: '加载中...',
          forbidClick: false
        })
      } catch (e) {
        console.log(e)
        this.$toast.fail('操作失败')
      }
    },
    // 请求文章详情
    async getArticleDetail () {
      try {
        const item = this.articleId.art_id
        const { data } = await getArticleDetail(item)
        this.articlelist = data.data
        this.isFollow = this.articlelist.is_followed
        this.isCollections = this.articlelist.is_collected
        this.isLikings = this.articlelist.attitude
        // console.log(this.articlelist.is_followed, 1)
        // console.log(this.isLikings, 2)
        console.log(this.articlelist, '文章信息')
      } catch (e) {
        this.$toast('获取失败')
      }
    },
    // 请求用户数据
    async getUserInfo () {
      const { data } = await getUserInfo()
      this.userList = data.data
      // console.log(this.userList, '用户信息')
    },
    // 返回
    onClickLeft () {
      this.$router.push('/ ')
      this.$toast('返回')
    },
    // 时间
    ArticleTime () {
      const relativeTime = dayjs(this.articlelist.pubdate).fromNow()
      return relativeTime
    }
  }
}
</script>

<style lang="less" scoped>
// 加载
.loading-wrap {
  padding: 200px 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}
// 头部
.article-title {
  width: 100%;
  position: fixed;
  top: 0;
  background-color: #3296fa;
  :deep(.van-nav-bar__title) {
    color: #fff;
    font-size: 0.42667rem;
  }
  :deep(.van-icon) {
    color: #fff;
    font-size: 0.42667rem;
  }
}
// 主体内容
.article-main {
  padding: 0 16px;
  // 头部标题
  .main-title {
    padding: 0.66667rem 0;
    margin: 0;
    h1 {
      font-size: 0.53333rem;
    }
  }
  // 作者信息框
  .Userbox {
    padding: 3px 0;
    .imgbox {
      width: 0.93333rem;
      height: 0.93333rem;
      overflow: hidden;
      border-radius: 50%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .Userbox-user {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      .Userbox-name {
        margin-bottom: 13px;
        font-size: 0.32rem;
        color: #3a3a3a;
      }
      .Userbox-time {
        font-size: 0.30667rem;
        color: #b7b7b7;
      }
    }

    .Userbox-btn {
      width: 2.26667rem;
      height: 0.77333rem;
    }
  }
  // 文章内容
  .main-text {
    padding: 0.73333rem 0;
    font-size: 0.21333rem;
    line-height: 1.5;
    color: #24292e;
  }
}
// 评论区
.Comment {
  display: flex;
  justify-content: start;
  padding: 0.26667rem 0.42667rem;
  border-bottom: 1px solid #bbbcbd;
  // 头像
  .comment-img {
    width: 0.96rem;
    height: 0.96rem;
    margin-right: 0.33333rem;
    overflow: hidden;
    border-radius: 50%;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  // 内容
  .comment-main {
    width: 100%;
    .comment-title {
      display: flex;
      justify-content: space-between;
      h3 {
        font-size: 0.34667rem;
        color: #406599;
        margin-top: 0;
      }
      :deep(.van-icon) {
        font-size: 0.4rem;
        span {
          margin-left: 5px;
          font-size: 0.25333rem;
        }
      }
    }
    p {
      font-size: 0.42667rem;
      color: #222;
    }
    span {
      font-size: 0.25333rem;
      color: #222;
      margin-right: 0.33333rem;
    }
    // 回复
    .reply {
      padding: 5px 16px;
      width: 1.8rem;
      height: 0.64rem;
      line-height: 0.64rem;
      font-size: 0.28rem;
      color: #222;
      border-radius: 26.64rem;
      border: 1px solid #ebedf0;
    }
    // 点赞
  }
}
// 底部
.boxx {
  height: 88px;
}
.article-bottom {
  margin-top: 88px;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 88px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 282px;
    height: 46px;
    border: 2px solid #eeeeee;
    font-size: 30px;
    line-height: 46px;
    color: #a7a7a7;
  }
  .van-icon {
    font-size: 40px;
    .van-info {
      font-size: 16px;
      background-color: #e22829;
    }
  }
}
</style>
