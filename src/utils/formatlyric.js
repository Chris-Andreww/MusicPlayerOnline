//解析带翻译的歌词
/**
 * 
 * @param lyricStr 原歌词字符串
 * @param translyricStr 翻译歌词字符串
 * @param keyArr 键组成的时间数组，用于对象遍历
 * @returns 
 */
export const trans_formatLyr = (lyricStr, translyricStr, keyArr) => {
  let reg = /\[[0-9]{1,2}:[0-9]{1,2}\.[0-9]{1,2}\]/g
  let timeArr = lyricStr.match(reg)
  let timeArr2 = translyricStr.match(reg)


  let contentArr = lyricStr.split(/\[[0-9]{1,2}:[0-9]{1,2}\.[0-9]{1,2}\]/).slice(1)
  let contentArr2 = translyricStr.split(/\[[0-9]{1,2}:[0-9]{1,2}\.[0-9]{1,2}\]/).slice(1)
  let lyricObj = {}//用来临时存放遍历时间和歌词的原歌词
  let translyricObj = {}//用来临时存放遍历时间和歌词的翻译歌词

  //遍历翻译歌词
  timeArr2?.forEach((item, index) => {
    let ms = '', ss = ''
    //用来判断音乐的时间格式为[0:01.00]还是[00:01.00]，方便切割
    if (item.split(':')[0].split('')[2]) {
      ms = item.split(':')[0].split('')[2] * 60
    } else {
      ms = item.split(':')[0].split('')[1] * 60
    }
    ss = item.split(':')[1].split('.')[0].split('')[0] === '0' ? item.split(':')[1].split('.')[0].split('')[1] : item.split(':')[1].split('.')[0]
    translyricObj[ms + Number(ss)] = contentArr2[index]
  })

  //遍历原始歌曲
  timeArr?.forEach((item, index) => {
    let ms = '', ss = ''
    //用来判断音乐的时间格式为[0:01.00]还是[00:01.00]，方便切割
    if (item.split(':')[0].split('')[2]) {
      ms = item.split(':')[0].split('')[2] * 60
    } else {
      ms = item.split(':')[0].split('')[1] * 60
    }
    ss = item.split(':')[1].split('.')[0].split('')[0] === '0' ? item.split(':')[1].split('.')[0].split('')[1] : item.split(':')[1].split('.')[0]
    lyricObj[ms + (ss * 1)] = contentArr[index]
  })

  for (let key in lyricObj) {
    if (translyricObj[key]) {
      lyricObj[key] = lyricObj[key] + '<br>' + translyricObj[key]
    }
  }
  let i = 0
  for (let time in lyricObj) {
    keyArr[i] = time
    i++
  }
  return lyricObj
}

/**
 * 
 * @param lyricStr 原歌词字符串
 * @param keyArr 键组成的时间数组，用于对象遍历
 * @returns 
 */
export const _formatLyr = (lyricStr, keyArr) => {
  let reg = /\[[0-9]{1,2}:[0-9]{1,2}\.[0-9]{1,2}\]/g
  let timeArr = lyricStr.match(reg)
  let contentArr = lyricStr.split(/\[[0-9]{1,2}:[0-9]{1,2}\.[0-9]{1,2}\]/).slice(1)

  let lyricObj = {}//用来临时存放遍历时间和歌词的原歌词
  timeArr?.forEach((item, index) => {
    let ms = '', ss = ''
    //用来判断音乐的时间格式为[0:01.00]还是[00:01.00]，方便切割
    if (item.split(':')[0].split('')[2]) {
      ms = item.split(':')[0].split('')[2] * 60
    } else {
      ms = item.split(':')[0].split('')[1] * 60
    }
    ss = item.split(':')[1].split('.')[0].split('')[0] === '0' ? item.split(':')[1].split('.')[0].split('')[1] : item.split(':')[1].split('.')[0]
    lyricObj[ms + (ss * 1)] = contentArr[index]
  })
  let i = 0
  for (let time in lyricObj) {
    keyArr[i] = time
    i++
  }
  return lyricObj

}