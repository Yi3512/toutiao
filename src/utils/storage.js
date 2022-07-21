// 封装本地存储
// class 封装
class Storage {
  set (key, value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    localStorage.setItem(key, value)
  }

  get (key) {
    const value = localStorage.getItem(key)
    try {
      // 如果parse的是一个JSON格式字符串 , return JSON.parse()
      return JSON.parse(value)
      // 不是就 返回原数据
    } catch {
      return value
    }
  }

  remove (key) {
    localStorage.removeItem(key)
  }
}

const storage = new Storage()
export default storage
