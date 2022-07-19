import request from '@/utils/request'
/**
 *
 * @param {*} channel_id 频道id
 * @param {*} tinestamp 获取第一页文章
 * @returns Promise
 */
export const getArticles = (channelId, timestamp) => {
  return request({
    url: '/v1_0/articles',
    params: {
      channel_id: channelId,
      timestamp
    }
  })
}
