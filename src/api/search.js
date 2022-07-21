import request from '@/utils/request'

/**
 * 获取搜索建议
 * @param {String} q 搜索建议的关键词
 * @returns Promise
 */
export const getSearchSuggestion = (q) => {
  return request({
    url: '/v1_0/suggestion',
    params: {
      q
    }
  })
}
/**
 * 获取搜索结果
 * @param {integer} page 当前页数
 * @param {integer} PerPage 每页数量
 * @param {*} q 搜索关键词
 * @returns Promise
 */
export const getSearchResult = (page, PerPage, q) => {
  return request({
    url: '/v1_0/search',
    params: {
      page,
      per_page: PerPage,
      q
    }
  })
}
