<template>
  <div class="side-main">
    <div class="none" v-if="!active">
      <p>当前无正在播放的音乐~~</p>
    </div>
    <play v-else></play>
  </div>
</template>
<script setup>
import Play from '@/views/Play'
import { usePlayId } from '@/store/index'
import { ref, watch, defineEmits } from 'vue'
const active = ref(false)
const store = usePlayId()
const emit =defineEmits(['showSlider'])

watch(() => store.id, (newv) => {
  if (newv != 0) {
    emit('showSlider')
    active.value = true
  }
})
</script>
<style lang="scss" scoped>
.side-main {
  width: 100%;
  height: 100%;
  background-color: rgba(137, 137, 137, 0.801);

  .none {
    display: flex;
    color: white;
    justify-content: center;
    margin-top: 50%;
    font-size: 20px;
  }
}
</style>
