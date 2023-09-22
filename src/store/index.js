import { defineStore } from "pinia";
import { ref } from "vue";

export const usePlayId = defineStore('playid', () => {
  const id = ref('') //歌曲id
  const uid = ref('')  //用户id
  const activeTab = ref(0)  //记录用户当前选择的tab标签
  const searchVal = ref('')
  const albumId = ref('')
  const djRadioId = ref('')
  const playListId = ref('')
  const curPlayList = ref([]) //存放当前的播放列表，用于切换歌曲

  return { id, searchVal, albumId, djRadioId, playListId, uid, activeTab, curPlayList }
},
  {
    persist: true
  }
)