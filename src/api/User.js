import request from '../utils/request'

// 获取用户登录状态
export const getUserStatus = () => request({
  url: '/login/status',
  method: "GET"
})

// 获取用户详情
export const getUserDetail = (uid) => request({
  url: `/user/detail?uid=${uid}`,
  method: "GET"
})

// 获取用户歌单信息
export const getUserPlayList = (uid) => request({
  url: `/user/playlist?uid=${uid}`,
  method: "GET"
})

//获取用户喜欢音乐列表
export const getUserLikeList = (uid) => request({
  url: `/likelist?uid=${uid}`,
  method: "GET"
})

// 用户登录
export const UserLogin = (userinfo) => request({
  url: `/login/cellphone?phone=${userinfo.phoneNumber}&password=${userinfo.password}`,
  method: "GET"
})
