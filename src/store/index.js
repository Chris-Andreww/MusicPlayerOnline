import { defineStore } from "pinia";
import { ref } from "vue";

export const usePlayId = defineStore('playid', () => {
  const id = ref(0)
  const searchVal = ref('')
  const albumId = ref('')
  return { id, searchVal, albumId }
})