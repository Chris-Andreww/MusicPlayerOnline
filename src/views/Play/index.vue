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
    <!-- 喜欢评论等操作面板 -->
    <div class="morePanel">
      <!-- 后添加的icon-xin1会覆盖前面的类icon-xin，使其显示实心的心按钮 -->
      <div class="like iconfont icon-xin" :class="{ 'icon-xin1': isLike }" @click="panelFun(0)"></div>
      <div class="add iconfont icon-xinjian" @click="panelFun(1)"></div>
      <div class="comment iconfont icon-pinglun" @click="panelFun(2)"></div>
      <div class="gengduo iconfont icon-gengduo" @click="panelFun(3)"></div>
    </div>
    <audio controls @ended="toNextSong()" ref="audio" preload="true" :src="songUrl"
      controlsList="nodownload noplaybackrate"></audio>
    <div class="controller">
      <div class="repeat iconfont icon-24gl-repeat2" @click="playRepOrRam(1)"></div>
      <div class="before iconfont icon-xiangzuoshouqi" @click="changeSongs(1)"></div>
      <div class="middle iconfont icon-bofang" @click="audioStart"></div>
      <div class="after iconfont icon-xiangyouzhankai" @click="changeSongs(2)"></div>
      <div class="random iconfont icon-24gl-shuffle" @click="playRepOrRam(2)"></div>
    </div>
    <!-- 收藏到歌单 -->
    <MoreFun :PlayList="PlayList" :id="id" @closeAddplaylist="closeAddplaylist"></MoreFun>
    <van-action-sheet cancel-text="取消" v-model:show="showMore" :actions="actions" @select="onSelect" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, getCurrentInstance } from 'vue'
import { getSongByIdAPI, getLyricByIdAPI, getSongUrlAPI, addLikeSongAPI, getUserLikeListAPI, getUserPlayListAPI } from '@/api'
import { usePlayId } from '@/store'
import { trans_formatLyr, _formatLyr } from '@/utils/formatlyric'
import { useRouter } from 'vue-router'

const playState = ref(false)  // 音乐播放状态(true播放, false暂停)
const router = useRouter()
const id = ref(0) // 音乐id
const songInfo = ref({})  // 歌曲信息
const lyric = ref({}) // 歌词对象
const playTime = ref(0) //记录当前播放的时间
const keyArr = ref({}) //负责存储所有的key值，用来判断当前歌词的显示时间
const store = usePlayId()
const refs = getCurrentInstance()
const curPlayList = ref([]) //存放当前歌单中显示的歌曲
const songUrl = ref('') //存放歌曲url
const toggleIndex = ref(0)  //切换歌曲时的歌曲索引
const isLike = ref(false)
const PlayList = ref([])  //保存用户收藏的歌单，用于添加歌曲至歌单
const showMore = ref(false);
const actions = [
  { name: '查看专辑', index: 1 },
  { name: '删除', index: 2 }
];

const onSelect = async (item) => {
  if (item.index == 1) {  //查看专辑
    store.albumId = songInfo.value.al.id
    router.push({
      path: '/layout/albumDetail'
    })
  } else if (item.index == 2) { //删除歌曲
    console.log(2);
  }
  showMore.value = false;
};

const needleDeg = computed(() => {
  return playState.value ? '-7deg' : '-38deg'
})

const closeAddplaylist = () => {
  PlayList.value = []
}

//点击右侧更多按钮,index值为0代表喜欢按钮，2是添加歌曲，3是评论，4更多操作
const panelFun = async (index) => {
  if (index == 0) {
    if (isLike.value) {
      await addLikeSongAPI(id.value, false) //取消喜欢
      isLike.value = false
      return
    }
    await addLikeSongAPI(id.value, true)
    isLike.value = true
  }
  if (index == 1) {
    //首先获取该用户的所有歌单
    let res = await getUserPlayListAPI(store.uid)
    //过滤出是用户创建的歌单而不是所有歌单
    PlayList.value = res.data.playlist.filter(obj => !obj.subscribed)
  }
  if (index == 2) { //前往歌曲评论
    router.push({
      path: '/layout/Comment'
    })
  }
  if (index == 3) {
    showMore.value = true
  }
}

//用于切换歌曲，1为上一首，2为下一首
const changeSongs = (btn) => {
  toggleIndex.value = curPlayList.value.indexOf(id.value)
  let index = toggleIndex.value
  if (curPlayList.value.length == 1) {
    return
  }
  if (btn == 1) {
    if (index == 0) { //如果已经是第一首，就切换到最后一首
      toggleIndex.value = curPlayList.value.length
      index = toggleIndex.value
    } else if (store.randomState) { //如果是随机播放，则上一首和下一首都进行随机
      randomSong()
      return
    }
    index--
    id.value = curPlayList.value[index]
    getSong()
  } else {
    if (index == curPlayList.value.length - 1) {  //如果是最后一首，就切换到第一首
      toggleIndex.value = -1
      index = -1
    } else if (store.randomState) {
      randomSong()
      return
    }
    index++
    id.value = curPlayList.value[index]
    getSong()
  }
}

//重复播放或随机播放，1为重复，2为随机
const playRepOrRam = (btn) => {
  let rep = document.querySelector('.repeat')
  let ram = document.querySelector('.random')
  let audio = document.querySelector("audio");

  if (btn == 1) {
    ram.classList.remove('active')
    rep.classList.toggle('active')
    audio.toggleAttribute("loop");  //第一次点击添加，第二次点击移除
    store.repeatState = !store.repeatState
    store.randomState = false
  } else {
    rep.classList.remove('active')
    ram.classList.toggle('active')
    audio.removeAttribute('loop')
    store.randomState = !store.randomState
    store.repeatState = false
  }
}

//自动切换到下一首
const toNextSong = () => {
  if (store.randomState) {
    randomSong()
    return
  }
  changeSongs(2)
}

//随机切换歌曲
const randomSong = () => {
  let randomIndex = Math.floor(Math.random() * curPlayList.value.length); // 生成随机下标
  id.value = curPlayList.value[randomIndex]
  getSong()
}

const getUserLikeList = async () => {
  //获取用户喜欢列表
  let userlike = await getUserLikeListAPI(store.uid, Date.now())
  //如果当前歌曲是用户喜欢过的，就显示红色的喜欢按钮
  if (userlike.data.ids.includes(id.value)) {
    isLike.value = true
    return
  }
  isLike.value = false
}

//用于恢复配置信息
const recoveryConfig = () => {
  if (store.repeatState) {
    playRepOrRam(1)
  } else if (store.randomState) {
    playRepOrRam(2)
  }
}

const getSong = async () => {
  const res = await getSongByIdAPI(id.value)
  const url = await getSongUrlAPI(id.value)
  songInfo.value = res.data.songs[0]
  songUrl.value = url.data.data[0].url

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
  getUserLikeList() //获取用户喜欢的列表
  playState.value = false //设置false，方便切歌时自动播放
  audioStart()  //自动播放音乐
}

const audioStart = () => {
  let doc = document.querySelector('.controller .middle')
  if (!playState.value) {
    //refs.refs用来代替vue2中的this.$refs
    refs.refs.audio.play()
    doc.classList.remove('icon-bofang')
    doc.classList.add("icon-zanting");
  } else {
    refs.refs.audio.pause()
    doc.classList.add('icon-bofang')
    doc.classList.remove("icon-zanting");
  }
  playState.value = !playState.value
}

const showLyric = () => {
  refs.refs.audio.addEventListener('timeupdate', () => {
    playTime.value = refs.refs.audio?.currentTime
  })
}

onMounted(() => {
  id.value = store.id
  curPlayList.value = store.curPlayList
  getSong()
  showLyric()
  recoveryConfig()
})

watch(() => playTime.value, () => {
  let element = document.querySelector('.lrcContent .active')
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
})

watch(() => store.id, (newv) => {
  id.value = newv
  curPlayList.value = store.curPlayList
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

  /* 当前播放时长 */
  &::-webkit-media-controls-current-time-display {
    color: white;
  }

  /* 总时长 */
  &::-webkit-media-controls-time-remaining-display {
    color: white;
  }
}

.header {
  position: relative;
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

  .morePanel {
    width: 100%;
    height: 30px;
    position: relative;
    box-sizing: border-box;
    padding: 0 10%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 5;
    color: rgba(224, 224, 224, 0.888);

    .like {
      font-size: 25px;
    }

    .add {
      font-size: 25px;
    }

    .comment {
      font-size: 25px;
    }

    .gengduo {
      font-size: 25px;
    }
  }

  .song-bg {
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: auto 100%;
    transform-origin: center;
    position: absolute;
    transform: scale(1.5);
    height: 80%;
    width: 100%;
    z-index: 1;
    opacity: 1;
    filter: blur(20px);
  }


}

.song-bg::before {
  /*纯白色的图片做背景, 歌词白色看不到了, 在背景前加入一个黑色半透明蒙层解决 */
  content: " ";
  background: rgba(0, 0, 0, 0.3);
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
  margin-top: 70px;
  margin-bottom: 30px;
  width: 100%;
  height: 25%;
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

.controller {
  width: 100%;
  padding: 60px 50px 0px;
  box-sizing: border-box;
  position: absolute;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 5;
  color: rgba(224, 224, 224, 0.888);

  .repeat {
    font-size: 20px;
    color: rgba(224, 224, 224, 0.888);

    &.active {
      color: rgb(250, 94, 94);
    }
  }

  .before {
    font-size: 30px;
  }

  .middle {
    font-size: 30px;
  }

  .after {
    font-size: 30px;
  }

  .random {
    font-size: 20px;
    color: rgba(224, 224, 224, 0.888);

    &.active {
      color: rgb(250, 94, 94);
    }
  }
}
</style>