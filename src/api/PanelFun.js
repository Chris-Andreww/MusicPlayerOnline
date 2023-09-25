import request from '../utils/request'

// 获取用户登录状态，islike为 true 即喜欢 , 若传 false, 则取消喜欢
export const addLikeSong = (id, islike) => request({
  url: `/like?id=${id}&like=${islike}`,
  method: "GET"
})
