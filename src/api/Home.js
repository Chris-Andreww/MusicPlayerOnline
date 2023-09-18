import request from '@/utils/request'

// 首页 - 推荐歌单
export const recommendMusic = params => request({
    url: '/personalized',
    params
    // 将来外面可能传入params的值 {limit: 20}
})

// 首页 - 推荐最新音乐
export const newMusic = params => request({
  url: "/personalized/newsong",
  params
})