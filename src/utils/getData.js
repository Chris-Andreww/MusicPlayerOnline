import { searchResultAPI, searchSuggestAPI, getPlayListTrackAPI, getdjRadioTrackAPI, getCommentsAPI, getFloorCommentsAPI } from "@/api";

/**
 * 
 * @param value 输入框内容
 * @param type 搜索类型
 * @param page 搜索页码
 * @returns 
 */
export const getSongsData = async (value, type, page) => {
  return await searchResultAPI({
    keywords: value,
    limit: 20,
    type: type, //搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合, 2000:声音
    offset: (page - 1) * 20,
  }); // 把搜索结果return出去
}

/**
 * 
 * @param value 搜索关键字
 * @returns 
 */
export const getSearchSuggest = async (value) => {
  return await searchSuggestAPI({
    keywords: value,
    type: 'mobile'
  });
}

/**
 * 
 * @param id 歌单ID 
 * @param page 歌单翻页
 * @returns 
 */
export const getPlayListTrack = async (id, page) => {
  return await getPlayListTrackAPI({
    id,
    limit: 20,
    offset: (page - 1) * 20,
    timestamp: Date.now()
  }); // 把搜索结果return出去
}

/**
 * 
 * @param id 播客ID 
 * @param page 播客翻页
 * @returns 
 */
export const getdjRadioTrack = async (rid, page) => {
  return await getdjRadioTrackAPI({
    rid,
    limit: 20,
    offset: (page - 1) * 20
  });
}

/**
 * 
 * @param id 歌曲id 
 * @param page 评论翻页 
 * @returns 
 */
export const getComments = async (id, page) => {
  return await getCommentsAPI({
    id,
    limit: 20,
    offset: (page - 1) * 20
  });
}

/**
 * 
 * @param {楼层评论id} parentCommentId 
 * @param {资源id} id 
 * @param {资源类型，0歌曲，2歌单，3专辑，4电台节目，7电台} type 
 * @param {页数} page 
 * @returns 
 */
export const getfloorComments = async (parentCommentId, id, type, page) => {
  return await getFloorCommentsAPI({
    parentCommentId,
    id,
    type,
    limit: 20,
    offset: (page - 1) * 20
  });
}