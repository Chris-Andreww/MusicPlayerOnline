import request from '../utils/request'

// 获取用户登录状态，islike为 true 即喜欢 , 若传 false, 则取消喜欢
export const addLikeSong = (id, islike) => request({
  url: `/like?id=${id}&like=${islike}`,
  method: "GET"
})

// 添加歌曲至歌单
export const addSongToList = (pid, id) => request({
  url: `/playlist/tracks?op=add&pid=${pid}&tracks=${id}&timestamp=${Date.now()}`,
  method: "GET"
})
