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
/**
 * 获取评论或评论回复
 * @param {string} type 评论类型 a-对文章(article)的评论，c-对评论(comment)的回复
 * @param {string} source 源id
 * @returns
 */
export const getComments = (params) => {
  return request({
    url: '/v1_0/comments',
    params
  })
}
/**
 * 收藏文章
 * @param {integer} target 收藏的目标文章id
 * @returns Promise
 */
export const AddCollections = (target) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/collections',
    data: {
      target
    }
  })
}
/**
 * 取消收藏文章
 * @param {integer} target 取消收藏的文章id
 * @returns Promise
 */
export const DeleteCollections = (target) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/collections/${target}`
  })
}
/**
 * 对文章点赞
 * @param {integer} target 文章id
 * @returns Promise
 */
export const AddLikings = (target) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: {
      target
    }
  })
}
/**
 * 取消文章点赞
 * @param {integer} target 文章id
 * @returns Promise
 */
export const DeleteLikings = (target) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/likings/${target}`
  })
}
/**
 * 对文章不喜欢
 * @param {integer} target 文章id
 * @returns Promise
 */
export const AddDislikes = (target) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/dislikes',
    data: {
      target
    }
  })
}
/**
 * 取消文章不喜欢
 * @param {integer} target 文章id
 * @returns Promise
 */
export const DeleteDislikes = (target) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/dislikes/${target}`
  })
}
/**
 * 对评论或评论回复点赞
 * @param {*} target 评论id
 * @returns Promise
 */
export const CommentLikings = (target) => {
  return request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: {
      target
    }
  })
}
/**
 * 取消对评论或评论回复点赞
 * @param {integer} target 评论id
 * @returns Promise
 */
export const noCommentLikings = (target) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${target}`
  })
}
/**
 * 添加评论或评论回复
 */
export const addComment = (data) => {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data
  })
}
