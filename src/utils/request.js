// 引入axios
import axios from 'axios'
import store from '@/store'
// 配置axios的默认配置
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net',
  timeout: 3000
})
// 拦截器
request.interceptors.request.use(
  // config 本次请求的配置
  (config) => {
    // config添加token
    const token = store.state.user.token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  // 请求错误的时候,的处理
  (error) => {
    return Promise.reject(error)
  }
)

export default request
