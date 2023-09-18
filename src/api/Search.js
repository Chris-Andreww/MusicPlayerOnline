import request from '@/utils/request'

// 热搜关键字
export const hotSearch = () => request({
  url: '/search/hot'
})

// 搜索建议
export const searchSuggest = params => request({
  url: '/search/suggest',
  params
})

// 搜索结果列表
export const searchResult = params => request({
  url: '/cloudsearch',
  params
})
