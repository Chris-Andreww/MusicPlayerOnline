// api文件夹下 各个请求模块js, 都统一来到index.js再向外导出
import { recommendMusic, newMusic } from './Home'
import { hotSearch, searchSuggest, searchResult } from './Search'
import { getSongById, getLyricById, getSongCheck } from './Play'
import { getAlbumById, getPlayListTrack, getPlayListDetail, getdjRadioDetail, getdjRadioTrack } from './Detail'
import { getUserStatus, UserLogin, getUserDetail, getUserPlayList, getUserLikeList } from './User'

export const recommendMusicAPI = recommendMusic // 请求推荐歌单的方法导出
export const newMusicAPI = newMusic// 首页 - 推荐最新音乐

export const hotSearchAPI = hotSearch // 热搜
export const searchSuggestAPI = searchSuggest // 搜索建议
export const searchResultAPI = searchResult // 搜索结果

export const getSongByIdAPI = getSongById // 歌曲 - 播放地址
export const getLyricByIdAPI = getLyricById // 歌曲 - 歌词数据
export const getSongCheckAPI = getSongCheck // 歌曲 - 歌词数据

export const getAlbumByIdAPI = getAlbumById // 专辑详情
export const getPlayListDetailAPI = getPlayListDetail // 歌单详情
export const getPlayListTrackAPI = getPlayListTrack // 歌单所有歌曲
export const getdjRadioDetailAPI = getdjRadioDetail // 播客详情
export const getdjRadioTrackAPI = getdjRadioTrack // 播客详情

export const getUserStatusAPI = getUserStatus // 获取用户登录状态
export const UserLoginAPI = UserLogin // 用户登录
export const getUserDetailAPI = getUserDetail // 用户详情
export const getUserPlayListAPI = getUserPlayList // 用户歌单
export const getUserLikeListAPI = getUserLikeList // 用户喜欢歌曲

