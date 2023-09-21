import { searchResultAPI, searchSuggestAPI, getPlayListTrackAPI } from "@/api";

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
    offset: (page - 1) * 20
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
    offset: (page - 1) * 20
  }); // 把搜索结果return出去
}