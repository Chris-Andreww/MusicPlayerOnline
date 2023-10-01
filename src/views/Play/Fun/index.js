import { getSongByIdAPI, getSongUrlAPI, getLyricByIdAPI } from "@/api"
import { trans_formatLyr, _formatLyr } from '@/utils/formatlyric'

export const getSongInfo = async (id) => {

  const res = await getSongByIdAPI(id)
  const songInfo = res.data.songs[0]
  //如果id有值就代表该歌曲是普通歌曲，有专辑id，如果id为0则代表该歌曲没有专辑，属于播单歌曲
  if (songInfo.al?.id) {
    return PlayListGetSong(id, songInfo)
  } else {
    return djRadioGetSong(id, songInfo)
  }
}

//用于获取普通歌曲的信息
export const PlayListGetSong = async (id, songInfo) => {
  let songUrl = ''
  let lyric = {}
  let keyArr = {}

  const url = await getSongUrlAPI(id)
  const lyrContent = await getLyricByIdAPI(id)

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

//用于获取播单歌曲的信息
export const djRadioGetSong = async (id, songInfo) => {
  let songUrl = ''
  let keyArr = {}
  let lyric = {}

  const url = await getSongUrlAPI(id)

  songUrl = url.data.data[0].url
  lyric[0] = '暂无歌词信息'

  return { songInfo, songUrl, lyric, keyArr }
}