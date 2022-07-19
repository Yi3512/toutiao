<template>
  <van-popup
    v-model="isShow"
    position="bottom"
    :style="{ height: '100%' }"
    closeable
    close-icon-position="top-left"
  >
    <div class="popupMain">
      <div class="my-channel">
        <van-cell title="我的频道">
          <van-button size="small" round class="edit-btn" @click="isEdit = !isEdit">{{isEdit ? '完成' : '编辑'}}</van-button>
        </van-cell>
        <!-- 我的频道 -->
        <van-grid :border="false" gutter="20px">
          <van-grid-item
            :text="item.name"
            v-for="item in myChannels"
            :key="item.id"
            :class="{'active-channel': item.name === '推荐'}"
            @click="onClickMyChannel(item)"
          >
            <template #icon>
              <van-icon v-show="isEdit && item.name !== '推荐'" name="cross" />
            </template>
          </van-grid-item>
        </van-grid>
      </div>
      <!-- 推荐频道 -->
      <div class="recommend-channel">
        <van-cell title="推荐频道"></van-cell>
        <!-- 推荐频道 -->
        <van-grid :border="false" gutter="20px">
          <van-grid-item
           v-for="item in recommendChannels"
            :key="item.id"
            :text="item.name"
            icon="plus"
            @click="addMyChannel(item)"
          ></van-grid-item>
        </van-grid>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { getAllChannels } from '@/api'
export default {
  props: {
    myChannels: {
      type: Array,
      required: true
    }
  },
  created () {
    this.getAllChannels()
  },
  data () {
    return {
      isShow: false,
      allChannels: [],
      isEdit: false
    }
  },
  methods: {
    async getAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
      console.log(this.allChannels)
    },
    onClickMyChannel (channel, index) {
      if (this.isEdit && channel.name !== '推荐') {
        return this.$emit('del-mychannel', channel.id)
      }
      if (!this.isEdit) {
        this.isShow = false
        this.$emit('channge-active', index)
      }
    },
    addMyChannel (myChannels) {
      this.$emit('add-mychannel', { ...myChannels })
    }
  },
  computed: {
    recommendChannels () {
      return this.allChannels.filter((item) => {
        return !this.myChannels.find((i) => i.id === item.id)
      })
    }
  }
}
</script>

<style lang="less" scoped>

.active-channel {
  color: red;
}

.popupMain {
  padding-top: 100px;
  .edit-btn {
    color: red;
    padding: 0 30px;
    height: 40px;
    border: 0.02667rem solid red;
  }
  .my-channel {
    :deep(.van-grid-item__content) {
      position: relative;
      height: 41px;
      background-color: #f4f5f6;
      .van-grid-item__icon-wrapper {
        position: absolute;
        top: 0;
        right: 0;
        .van-icon-cross {
          position: absolute;
          font-size: 15px;
          top: 0;
          right: 0;
          transform: translate(20%, -35%);
          border: 1px solid #000;
          border-radius: 50%;
          text-align: center;
          line-height: 25px;
        }
      }
    }
  }
  // 推荐频道的样式
  .recommend-channel {
    // 推荐频道加号样式
    :deep(.van-grid-item__content) {
      flex-direction: row;
      height: 41px;
      background-color: #f4f5f6;
      font-size: 12px;
      .van-grid-item__icon {
        font-size: 30px;
      }

      .van-grid-item__text {
        margin-top: 0;
      }
    }
  }
}
</style>
