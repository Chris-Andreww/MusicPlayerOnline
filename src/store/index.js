import { defineStore } from "pinia";
import { ref } from "vue";

export const usePlayId = defineStore('playid', () => {
  const id = ref('') //歌曲id
  const uid = ref('')  //用户id
  const searchVal = ref('')
  const detailId = ref('')  //详情页Id
  return { id, searchVal, detailId, uid }
},
  {
    persist: true
  }
)