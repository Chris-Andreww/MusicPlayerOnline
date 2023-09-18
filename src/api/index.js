// api文件夹下 各个请求模块js, 都统一来到index.js再向外导出
import { recommendMusic, newMusic } from './Home'
import { hotSearch, searchSuggest, searchResult } from './Search'
import { getSongById, getLyricById, getSongCheck } from './Play'

export const recommendMusicAPI = recommendMusic // 请求推荐歌单的方法导出
export const newMusicAPI = newMusic// 首页 - 推荐最新音乐

export const hotSearchAPI = hotSearch // 热搜
export const searchSuggestAPI = searchSuggest // 搜索建议
export const searchResultAPI = searchResult // 搜索结果

export const getSongByIdAPI = getSongById // 歌曲 - 播放地址
export const getLyricByIdAPI = getLyricById // 歌曲 - 歌词数据
export const getSongCheckAPI = getSongCheck // 歌曲 - 歌词数据
