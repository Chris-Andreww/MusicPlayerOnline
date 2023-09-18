<template>
  <div class="play">
    <!-- 模糊背景(靠样式设置) -->
    <div class="song-bg" :style="`background-image: url(${songInfo?.al?.picUrl ?? ''})`"></div>
    <!-- 播放页头部导航 -->
    <div class="header">
      <!-- 歌曲名 -->
      <h2 class="m-song-h2">
        <span class="m-song-sname">{{ songInfo.name }}-{{
          songInfo && songInfo.ar && songInfo.ar[0].name
        }}</span>
      </h2>
    </div>
    <!-- 留声机 - 容器 -->
    <div class="song-wrapper">
      <!-- 留声机本身(靠css动画做旋转) -->
      <div class="song-turn ani" :style="`animation-play-state:${playState ? 'running' : 'paused'}`">
        <div class="song-img">
          <!-- &&写法是为了防止报错, 有字段再继续往下访问属性 -->
          <img style="width: 100%" :src="songInfo?.al?.picUrl ?? ''" alt="" />
        </div>
      </div>
      <!-- 播放按钮 -->
      <div class="start-box" @click="audioStart">
        <span class="song-start" v-show="!playState"></span>
      </div>
      <!-- 留声机 - 唱臂 -->
      <div class="needle" :style="`transform: rotate(${needleDeg});`"></div>
    </div>
    <!-- 歌词部分-随着时间切换展示一句歌词 -->
    <div class="lrcContent">
      <ul class="lrc" :class="{ active: playTime >= keyArr[index] && playTime < keyArr[index + 1] }"
        v-for="(val, key, index) in lyric" :key="index">
        <li v-html="val"></li>
      </ul>
    </div>
    <audio controls @ended="playState = false" ref="audio" preload="true"
      :src="`https://music.163.com/song/media/outer/url?id=${id}.mp3`"></audio>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, getCurrentInstance } from 'vue'
import { getSongByIdAPI, getLyricByIdAPI } from '@/api'
import { usePlayId } from '@/store'
import { trans_formatLyr, _formatLyr } from '@/utils/formatlyric'

const playState = ref(false)  // 音乐播放状态(true播放, false暂停)
const id = ref(0) // 音乐id
const songInfo = ref({})  // 歌曲信息
const lyric = ref({}) // 歌词对象
const playTime = ref(0) //记录当前播放的时间
const keyArr = ref({}) //负责存储所有的key值，用来判断当前歌词的显示时间
const store = usePlayId()
const refs = getCurrentInstance()

const needleDeg = computed(() => {
  return playState.value ? '-7deg' : '-38deg'
})

const getSong = async () => {
  const res = await getSongByIdAPI(id.value)
  songInfo.value = res.data.songs[0]

  lyric.value = {}
  keyArr.value = {}
  const lyrContent = await getLyricByIdAPI(id.value)
  if (lyrContent.data.tlyric?.lyric) { //如果歌词有翻译
    let translyricStr = lyrContent.data.tlyric.lyric
    let lyricStr = lyrContent.data.lrc.lyric
    //解析带翻译的歌词
    lyric.value = trans_formatLyr(lyricStr, translyricStr, keyArr.value);
  } else {
    let lyricStr = lyrContent.data.lrc.lyric
    //解析不带翻译的歌词
    lyric.value = _formatLyr(lyricStr, keyArr.value)
  }
  if (!Object.keys(lyric.value).length) { //如果遍历的歌词对象中没有内容，则没有歌词
    lyric.value[0] = '暂无歌词信息'
  }
}

const audioStart = () => {
  if (!playState.value) {
    //refs.ctx.$refs用来代替vue2中的this.$refs
    refs.ctx.$refs.audio.play()
  } else {
    refs.ctx.$refs.audio.pause()
  }
  playState.value = !playState.value
}

const showLyric = () => {
  refs.ctx.$refs.audio.addEventListener('timeupdate', () => {
    playTime.value = refs.ctx.$refs.audio?.currentTime
  })
}

onMounted(() => {
  id.value = store.id
  getSong()
  showLyric()
})

watch(() => playTime.value, () => {
  let element = document.querySelector('.lrcContent .active')
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
})

watch(() => store.id, (newv) => {
  playState.value = false  //如果用户在播放时切换音乐，就暂停封面旋转
  id.value = newv
  getSong()
  showLyric()
})

</script>

<style lang="scss" scoped>
audio {
  position: absolute;
  width: 100%;
  z-index: 22;

  &::-webkit-media-controls-enclosure {
    background-color: transparent;
  }

  &::-webkit-media-controls-play-button {
    display: none;
  }
}

.header {
  height: 50px;
  display: flex;
  justify-content: center;

  .m-song-h2 {
    position: absolute;
    margin-top: 20px;
    text-align: center;
    font-size: 18px;
    color: #fefefe;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    z-index: 20;
  }

  .left-incon {
    position: absolute;
    margin-top: 20px;
    left: 10px;
    font-size: 24px;
    z-index: 2;
    color: #fff;
  }
}

.play {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 2;
  overflow: hidden;
}

.song-bg {
  background-color: #161824;
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: auto 100%;
  transform-origin: center;
  position: absolute;
  transform: scale(1.5);
  height: 100%;
  width: 100%;
  z-index: 1;
  opacity: 1;
  filter: blur(20px);
}

.song-bg::before {
  /*纯白色的图片做背景, 歌词白色看不到了, 在背景前加入一个黑色半透明蒙层解决 */
  content: " ";
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.song-wrapper {
  position: relative;
  width: 247px;
  height: 247px;
  left: 50%;
  top: 50px;
  transform: translateX(-50%);
  z-index: 2;
}

.song-turn {
  width: 100%;
  height: 100%;
  background: url("./img/bg.png") no-repeat;
  background-size: 100%;
}

.start-box {
  position: absolute;
  width: 156px;
  height: 156px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.song-start {
  width: 56px;
  height: 56px;
  background: url("./img/start.png");
  background-size: 100%;
}

.needle {
  position: absolute;
  transform-origin: left top;
  background: url("./img/needle-ab.png") no-repeat;
  background-size: contain;
  width: 73px;
  height: 118px;
  top: -40px;
  left: 112px;
  transition: all 0.6s;
}

.song-img {
  width: 154px;
  height: 154px;
  position: absolute;
  left: 50%;
  top: 50%;
  overflow: hidden;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.lrcContent {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 50px;
  width: 100%;
  height: 300px;
  overflow: auto;
  z-index: 10;
}

.lrc {
  padding: 5px 20px;
  font-size: 18px;
  color: #a9a8a8;
  text-align: center;
  word-break: break-word;
  transition: all 0.3s;
}

.lrc.active {
  font-size: 20px;
  color: #fff;
  text-align: center;
}

.ani {
  animation: turn 20s linear infinite;
}

@keyframes turn {
  0% {
    -webkit-transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}
</style>