<template>
  <div>
    <van-nav-bar>
      <template>
        <van-button round> <van-icon name="search" />搜索</van-button>
      </template>
    </van-nav-bar>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.navbar {
  background-color: #3296fa;
  color: #fff;
  .van-button {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
  }
  :deep(.van-nav-bar__title) {
    max-width: unset;
  }
  .van-button__text {
    color: #fff;
  }
  .van-icon-search {
    color: #fff;
  }
  .van-button--default {
    border: 0.02667rem solid #5babfb;
  }
}
</style>
