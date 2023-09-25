<template>
  <div class="toast">{{ message }}</div>
</template>

<script setup>
import { ref, defineExpose } from 'vue';

const message = ref('')

/**
 * 
 * @param msg 弹窗信息
 * @param duration 弹窗持续时间
 */
const trigger = (msg, duration) => {
  message.value = msg
  let elem = document.querySelector('.toast')
  elem.classList.add('fadein')
  setTimeout(() => {
    elem.classList.remove('fadein')
  }, duration)
}
defineExpose({
  trigger
})
</script>
<style lang="scss" scoped>
.toast {
  position: fixed;
  transform: translateX(-50%);
  font-size: 20px;
  padding: 10px 20px;
  color: white;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.8);
  left: 50%;
  top: 50%;
  opacity: 0;
  z-index: 50;

  transition: opacity 1s;

  &.fadein {
    opacity: 1;
  }
}
</style>