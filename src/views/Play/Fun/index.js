import { getSongByIdAPI, getSongUrlAPI, getLyricByIdAPI } from "@/api"
import { trans_formatLyr, _formatLyr } from '@/utils/formatlyric'

//用于获取普通歌曲的信息
export const PlayListGetSong = async (id) => {
  let songInfo = {}
  let songUrl = ''
  let lyric = {}
  let keyArr = {}

  const res = await getSongByIdAPI(id)
  const url = await getSongUrlAPI(id)
  const lyrContent = await getLyricByIdAPI(id)

  songInfo = res.data.songs[0]
  songUrl = url.data.data[0].url

  if (lyrContent.data.tlyric?.lyric) { //如果歌词有翻译
    let translyricStr = lyrContent.data.tlyric.lyric
    let lyricStr = lyrContent.data.lrc.lyric
    //解析带翻译的歌词
    lyric = trans_formatLyr(lyricStr, translyricStr, keyArr);
  } else {
    let lyricStr = lyrContent.data.lrc.lyric
    //解析不带翻译的歌词
    lyric = _formatLyr(lyricStr, keyArr)
  }
  if (!Object.keys(lyric).length) { //如果遍历的歌词对象中没有内容，则没有歌词
    lyric[0] = '暂无歌词信息'
  }
  return { songInfo, songUrl, lyric, keyArr }
}