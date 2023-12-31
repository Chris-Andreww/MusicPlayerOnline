import request from '../utils/request'

// 获取专辑详情
export const getAlbumById = (id) => request({
  url: `/album?id=${id}`,
  method: "GET"
})

// 获取歌单所有歌曲
export const getPlayListTrack = params => request({
  url: '/playlist/track/all',
  params
})

// 获取歌单详情
export const getPlayListDetail = (id) => request({
  url: `/playlist/detail?id=${id}`,
  method: "GET"
})

// 获取播客详情
export const getdjRadioDetail = (id) => request({
  url: `/dj/detail?rid=${id}`,
  method: "GET"
})

// 获取播客所有歌曲
export const getdjRadioTrack = params => request({
  url: '/dj/program',
  params
})