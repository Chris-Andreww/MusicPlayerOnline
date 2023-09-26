import request from '../utils/request'

// 获取专辑详情
export const getComments = params => request({
  url: '/comment/music',
  params
})