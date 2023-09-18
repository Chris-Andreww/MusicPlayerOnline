import { defineStore } from "pinia";
import { ref } from "vue";

export const usePlayId = defineStore('playid', () => {
  const id = ref(0)
  return { id }
})