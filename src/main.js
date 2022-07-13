import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
// 引入字体图标css
import '@/assets/font/iconfont.css'
// 引入flexble
import 'amfe-flexible'
// 引入vant
import Vant from 'vant'
import 'vant/lib/index.css'

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
