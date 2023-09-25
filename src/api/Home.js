import request from '@/utils/request'

// 每日推荐歌单
export const recPlayList = () => request({
  url: '/recommend/resource',
  method: 'GET'
})

// 每日推荐歌曲
export const recsongs = () => request({
  url: "/recommend/songs",
  method: 'GET'
})