import { defineStore } from "pinia";
import { ref } from "vue";

export const usePlayId = defineStore('playid', () => {
  const id = ref(0) //歌曲id
  const uid = ref('')  //用户id
  const repeatState = ref(false) //记录用户选择循环或随机播放，用于下次启动时恢复配置
  const randomState = ref(false)  //记录用户选择循环或随机播放
  const searchVal = ref('')
  const albumId = ref('')
  const djRadioId = ref('')
  const playListId = ref('')
  const curPlayList = ref([]) //存放当前的播放列表，用于切换歌曲
  const showSlideBar = ref(false)

  return { id, searchVal, albumId, djRadioId, playListId, uid, curPlayList, repeatState, randomState, showSlideBar }
},
  {
    persist: {
      paths: ['uid', 'repeatState', 'randomState', 'albumId', 'djRadioId', 'playListId']
    }
  }
)