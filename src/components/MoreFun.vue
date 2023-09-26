<template>
  <div>
    <div class="mask" @click="closeAddplaylist" v-if="PlayList.length">
      <div class="addplaylistMsg">收藏到歌单</div>
      <van-list class="addplaylist">
        <van-cell v-for="(obj, index) in PlayList" center :title="obj.name" @click.stop="addToList(obj.id, id)"
          :label="`${obj.trackCount}首`" :key="index">
          <template #icon>
            <img v-img-lazy="obj.coverImgUrl" style="width: 15%;padding-right: 10px;">
          </template>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>
<script setup>
import { addSongToListAPI } from '@/api';
import { defineProps, defineEmits } from 'vue';
import { showToast } from 'vant';

const emit = defineEmits(['closeAddplaylist'])

const closeAddplaylist = () => {
  emit('closeAddplaylist')
}

defineProps({
  PlayList: Array,
  id: Number  //歌曲id
})

//添加歌曲到歌单，pid为歌单id，id为歌曲id
const addToList = async (pid, id) => {
  let res = await addSongToListAPI(pid, id)
  if (res.data.body.code != 200) {
    showToast(res.data.body.message)
    closeAddplaylist()
    return
  }
  showToast('已收藏到歌单')
  closeAddplaylist()
}
</script>
<style scoped>
.mask {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 灰色半透明背景 */
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 30;

  .addplaylistMsg {
    width: 80%;
    background-color: white;
    text-align: center;
    font-size: 18px;
    box-sizing: border-box;
    padding: 10px;
  }

  .addplaylist {
    width: 80%;
    height: 50%;
    overflow: scroll;
  }
}
</style>