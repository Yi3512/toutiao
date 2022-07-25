<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 文件上传输入框 隐藏 -->
    <input type="file" hidden ref="file" />
    <!-- 头像 -->
    <van-cell title="头像" is-link @click="imgupData">
      <van-image
        class="avatar"
        fit="cover"
        round
        :src="user.photo"
        @click="isUpdatePhotoShow = true"
      />
      <!-- 触发file的点击事件 -->
    </van-cell>
    <!-- 编辑头像弹层 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      style="height: 100%"
      position="bottom"
    >
      <updatePhoto
        v-if="isUpdatePhotoShow"
        :photo="photo"
        @close="isUpdatePhotoShow = false"
        @update-photo="user.photo = $event"
      />
    </van-popup>
    <!-- 编辑头像弹层 -->
    <!-- 头像 -->

    <!-- 昵称 -->
    <!-- 把用户的名字传个组件 -->
    <van-cell
      title="昵称"
      @click="isShowUpdateName = true"
      :value="user.name"
      is-link
    />
    <!-- 编辑昵称弹层 -->
    <van-popup
      v-model="isShowUpdateName"
      style="height: 100%"
      position="bottom"
    >
      <!-- 用v-model来实现父子组件的动态更新 -->
      <update-name
        v-if="isShowUpdateName"
        v-model="user.name"
        @close="isShowUpdateName = false"
      />
    </van-popup>
    <!-- 编辑昵称弹层 -->
    <!-- 昵称 -->

    <!-- 性别 -->
    <van-cell
      title="性别"
      :value="user.gender ? '女' : '男'"
      is-link
      @click="isShowUpdateGender = true"
    />
    <!-- 编辑性别弹层 -->
    <van-popup v-model="isShowUpdateGender" position="bottom">
      <update-gender
        v-if="isShowUpdateGender"
        v-model="user.gender"
        @close="isShowUpdateGender = false"
      />
    </van-popup>
    <!-- 编辑性别弹层 -->
    <!-- 性别 -->

    <!-- 生日 -->
    <van-cell
      title="生日"
      @click="isShowUpdateBirthdy = true"
      :value="user.birthday || '1977-00-00'"
      is-link
    />
    <!-- 编辑生日弹层 -->
    <van-popup v-model="isShowUpdateBirthdy" position="bottom">
      <update-birthdy
        @close="isShowUpdateBirthdy = false"
        v-model="user.birthday"
        v-if="isShowUpdateBirthdy"
      />
    </van-popup>
    <!-- 编辑生日弹层 -->
    <!-- 生日 -->
  </div>
</template>

<script>
import updatePhoto from './components/update-photo.vue'
import updateBirthdy from './components/update-birthdy.vue'
import updateGender from './components/update-gender.vue'
import updateName from './components/update-name.vue'
import { getUserProfile } from '@/api'
export default {
  name: 'userProfile',
  components: {
    updateName,
    updateGender,
    updateBirthdy,
    updatePhoto
  },
  data () {
    return {
      // 用户个人信息
      user: {},
      // 昵称弹窗控制
      isShowUpdateName: false,
      // 生日弹窗控制
      isShowUpdateBirthdy: false,
      // 性别弹窗控制
      isShowUpdateGender: false,
      // 头像弹窗
      isUpdatePhotoShow: false,
      // 图片路径
      photo: ''
    }
  },
  created () {
    this.getUserProfile()
  },
  mounted () {
    // 在DOM更新完成之后，文件上传之后会触发自身的cahange事件，监听文件上传框的change事件，利用事件对象e.target捕捉到上传完成的文件
    this.$refs.file.addEventListener('change', (e) => {
      // 其捕捉到的事件对象e中的e.target中会携带一盒files伪数组数据，在其原型对象的原型对象Blob上存放着该文件的base64格式的文件数据
      console.log(e)
      // 定义一个常量接收e.target.files伪数组中的文件对象，因为这里只上传一个文件，所以直接[0]接收即可
      // 第一种方法，URL.createObjectURL() 静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象的 URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的 URL 对象表示指定的 File 对象或 Blob 对象。
      const file = e.target.files[0]
      // file = URL.createObjectURL(file) // 将file对象转换成图片可识别的url
      const fr = new FileReader()
      fr.readAsDataURL(file)

      fr.onload = (e) => {
        this.photo = e.target.result
        this.isUpdatePhotoShow = true
      }
    })
  },
  methods: {
    // 获取用户个人信息
    async getUserProfile () {
      try {
        // 获取数据
        const res = await getUserProfile()
        // 把数据放进user数组
        this.user = res.data.data
      } catch (err) {
        this.$toast('获取数据失败')
      }
    },
    imgupData () {
      this.$refs.file.click()
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
}
</style>
