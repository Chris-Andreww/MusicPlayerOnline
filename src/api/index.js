// api文件夹下 各个请求模块js, 都统一来到index.js再向外导出
import { recPlayList, recsongs } from './Home'
import { hotSearch, searchSuggest, searchResult } from './Search'
import { getSongById, getLyricById, getSongCheck, getSongUrl } from './Play'
import { getAlbumById, getPlayListTrack, getPlayListDetail, getdjRadioDetail, getdjRadioTrack } from './Detail'
import { getUserStatus, UserLogin, getUserDetail, getUserPlayList, getUserLikeList, makeQRCodekey, makeQRCode, checkQRCode, GetAnonimous } from './User'
import { addLikeSong, addSongToList, delSongToList } from './PanelFun'
import { getComments, getFloorComments } from './comments'

export const recPlayListAPI = recPlayList // 请求推荐歌单的方法导出
export const recsongsAPI = recsongs// 首页 - 推荐最新音乐

export const hotSearchAPI = hotSearch // 热搜
export const searchSuggestAPI = searchSuggest // 搜索建议
export const searchResultAPI = searchResult // 搜索结果

export const getSongByIdAPI = getSongById // 歌曲 - 播放地址
export const getLyricByIdAPI = getLyricById // 歌曲 - 歌词数据
export const getSongCheckAPI = getSongCheck
export const getSongUrlAPI = getSongUrl


export const getAlbumByIdAPI = getAlbumById // 专辑详情
export const getPlayListDetailAPI = getPlayListDetail // 歌单详情
export const getPlayListTrackAPI = getPlayListTrack // 歌单所有歌曲
export const getdjRadioDetailAPI = getdjRadioDetail // 播客详情
export const getdjRadioTrackAPI = getdjRadioTrack // 播客详情

export const getUserStatusAPI = getUserStatus // 获取用户登录状态
export const UserLoginAPI = UserLogin // 用户登录
export const makeQRCodekeyAPI = makeQRCodekey // 生成key二维码接口
export const makeQRCodeAPI = makeQRCode // 生成二维码接口
export const checkQRCodeAPI = checkQRCode // 二维码检测接口
export const GetAnonimousAPI = GetAnonimous // 获取游客账号

export const getUserDetailAPI = getUserDetail // 用户详情
export const getUserPlayListAPI = getUserPlayList // 用户歌单
export const getUserLikeListAPI = getUserLikeList // 用户喜欢歌曲

export const addLikeSongAPI = addLikeSong // 添加喜欢歌曲
export const addSongToListAPI = addSongToList // 添加喜欢至歌单
export const delSongToListAPI = delSongToList // 从歌单删除歌曲

export const getCommentsAPI = getComments // 获取歌曲评论
export const getFloorCommentsAPI = getFloorComments //获取楼层评论