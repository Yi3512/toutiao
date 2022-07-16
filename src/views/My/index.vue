<template>
  <div class="my">
    <header>
      <div v-if="isLogin" class="user-info banner">
        <van-row></van-row>
        <!--  -->
        <van-row class="row-2">
          <!-- 头像信息 -->
          <van-col span="12">
            <van-row type="flex" align="center" justify="space-around">
              <van-image
                round
                width="1.76rem"
                height="1.76rem"
                :src="userInfo.photo"
              />
              <span class="mobile">{{userInfo.name}}</span>
            </van-row>
          </van-col>
          <!-- 编辑资料 -->
          <van-col span="11">
            <van-row class="code-row" type="flex" align="center" justify="end">
              <van-button class="code-btn" size="mini" round>
                编辑资料
              </van-button>
            </van-row>
          </van-col>
        </van-row>
        <van-row>
          <van-grid class="grid" :border="false">
            <van-grid-item text="头条"
              ><template #icon> 1{{ userInfo.art_count }} </template></van-grid-item
            >
            <van-grid-item text="粉丝"
              ><template #icon> 1{{ userInfo.fans_count }} </template></van-grid-item
            >
            <van-grid-item text="关注"
              ><template #icon> 1{{ userInfo.follow_count }} </template></van-grid-item
            >
            <van-grid-item text="获赞"
              ><template #icon> 1{{ userInfo.like_count }} </template></van-grid-item
            >
          </van-grid>
        </van-row>
        <!--  -->
      </div>
      <div v-else class="login-register banner">
        <div class="wrap" @click="gologin">
          <img src="../../assets/images/mobile.png" alt="" />
          <span>登录 / 注册</span>
        </div>
      </div>
    </header>
    <!--  -->
    <main>
      <!-- 历史、搜索 -->
      <div>
        <van-grid column-num="2" clickable class="grid">
          <van-grid-item text="收藏">
            <template #icon>
              <span class="toutiao toutiao-shoucang"></span>
            </template>
          </van-grid-item>
          <van-grid-item text="历史">
            <template #icon>
              <span class="toutiao toutiao-lishi"></span>
            </template>
          </van-grid-item>
        </van-grid>
      </div>
      <!-- 消息通知 -->
      <div class="link">
        <van-cell title="消息通知" is-link />
        <van-cell title="小智同学 " is-link />
      </div>
    </main>
    <van-button v-if="isLogin" block class="login-btn" @click="logout">
      退出</van-button
    >
  </div>
</template>

<script>
import { getUserInfo } from '@/api'
export default {
  data () {
    return {
      userInfo: {}
    }
  },
  computed: {
    isLogin () {
      return !!this.$store.state.user.token
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    logout () {
      this.$dialog.confirm({
        title: '黑马头条',
        message: '是否退出该账号'
      })
        .then(() => {
          // on confirm
          this.$store.state.user = {}
        })
        .catch(() => {
          // on cancel
        })
    },
    gologin () {
      this.$router.push('/login')
    },
    async getUserInfo () {
      if (this.isLogin) {
        try {
          const {
            data: { data }
          } = await getUserInfo()
          this.userInfo = data
          console.log(data)
        } catch (error) {
          this.$toast.fail('请重新登录')
        }
      }
      console.log(this.userInfo)
    }
  }
}
</script>

<style lang="less" scoped>
.my {
  background-color: #f5f7f9;
  height: calc(100vh - 100px);
}
.banner {
  width: 100%;
  height: 400px;
  background: url('../../assets/images/banner.png') no-repeat 0 0 / cover;
}
.login-register {
  display: flex;
  justify-content: center;
  align-items: center;
  .wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    color: #fff;
    img {
      margin-bottom: 10px;
      width: 150px;
      height: 150px;
    }
  }
}
.user-info {
  display: flex;
  flex-direction: column;
  > .van-row {
    flex: 1;
  }
  .row-2 {
    .van-col {
      height: 100%;
    }
  }

  .mobile {
    font-size: 0.4rem;
    color: #fff;
  }
  .code-btn {
    width: 1.53333rem;
    height: 0.42667rem;
    background: #fff;
    border-radius: 0.21333rem;
    font-size: 0.26667rem;
    color: #666;
    padding: 0;
  }

  .code-row {
    height: 100%;
  }
  .grid {
    :deep(.van-grid-item__content) {
      background-color: unset;
    }
  }
  .van-grid-item {
    color: #fff;
    :deep(.van-grid-item__text) {
      color: #fff;
    }
  }
}
// 主体区域
main {
  .grid {
    color: #646566;
    // 字体图标
    .toutiao {
      font-size: 0.6rem;

      &.toutiao-lishi {
        color: #ffb31d;
      }
      &.toutiao-shoucang {
        color: #ed5253;
      }
    }
  }
  .link {
    margin: 10px 0;
  }
}
.login-btn {
  span {
    color: red;
  }
}
</style>
