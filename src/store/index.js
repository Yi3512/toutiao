import Vue from 'vue'
import Vuex from 'vuex'
import { getToken, setToken } from '@/utils'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    // 声明token
    user: getToken() || {},
    History: JSON.parse(localStorage.getItem('History')) || []
  },
  mutations: {
    // 修改token
    setUser (state, payload) {
      state.user = payload
      // token放在本地存储
      setToken(payload)
    },
    setSearchHistory (state, val) {
      state.History = val
      localStorage.setItem('History', JSON.stringify(val) || [])
    }
  }
})
