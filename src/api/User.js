import request from '../utils/request'

// 获取用户登录状态
export const getUserStatus = () => request({
  url: `/login/status?timestamp=${Date.now()}`,
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
export const getUserLikeList = (uid, timestamp) => request({
  url: `/likelist?uid=${uid}&timestamp=${timestamp}`,
  method: "GET"
})

// 用户登录
export const UserLogin = (phoneNumber, password) => request({
  url: `/login/cellphone?phone=${phoneNumber}&password=${password}`,
  method: "GET"
})

// 二维码 key 生成接口，添加时间戳，防止浏览器读取缓存导致二维码过期无法重新获取
export const makeQRCodekey = (timestamp) => request({
  url: `/login/qr/key?timestamp=${timestamp}`,
  method: "GET"
})

// 二维码生成接口
export const makeQRCode = (key) => request({
  url: `/login/qr/create?qrimg=true&key=${key}`,
  method: "GET"
})

//二维码检测扫码状态接口，添加时间戳，防止浏览器读取缓存导致二维码过期无法重新获取
export const checkQRCode = (key, timestamp) => request({
  url: `/login/qr/check?key=${key}&timestamp=${timestamp}`,
  method: "GET"
})

//获取游客账号，避免某些接口报错
export const GetAnonimous = () => request({
  url: '/register/anonimous',
  method: "GET"
})