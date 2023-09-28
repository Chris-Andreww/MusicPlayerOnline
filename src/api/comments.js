import request from '../utils/request'

// 获取歌曲
export const getComments = params => request({
  url: '/comment/music',
  params
})

// 楼层评论
export const getfloorComments = params => request({
  url: '/comment/floor',
  params
})