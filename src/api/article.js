import request from '@/utils/request'

/**
 * 获取文章详情
 * @param {string} article 文章id
 * @returns Promise
 */
export const getArticleDetail = (article) => {
  return request({
    url: `/v1_0/articles/${article}`
  })
}
