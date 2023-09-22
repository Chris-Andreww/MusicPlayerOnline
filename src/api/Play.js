import request from '../utils/request'

// 获取歌曲url信息
export const getSongUrl = (id) => request({
  url: `/song/url/v1?id=${id}&level=standard`,
  method: "GET"
})

// 播放页 - 获取歌曲详情
export const getSongById = (id) => request({
  url: `/song/detail?ids=${id}`,
  method: "GET"
})

// 获取歌曲是否可用（非会员、无版权）
export const getSongCheck = (id) => request({
  url: `/check/music?id=${id}`,
  method: "GET"
})

// 播放页 - 获取歌词
export const getLyricById = (id) => request({
  url: `/lyric?id=${id}`,
  method: "GET"
})
