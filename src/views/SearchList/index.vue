<template>
  <div class="search_wrap">
    <van-tabs v-model:active="active">
      <van-tab title="单曲">
        <singleSongs :value="inputValue" :type="1"></singleSongs>
      </van-tab>
      <van-tab title="专辑">
        <albumList :value="inputValue" :type="10"></albumList>
      </van-tab>
      <van-tab title="播客">
        <djRadio :value="inputValue" :type="1009"></djRadio>
      </van-tab>
      <van-tab title="歌手">
        <singerList :value="inputValue" :type="100"></singerList>
      </van-tab>
      <van-tab title="歌单">
        <PlaySheetList :value="inputValue" :type="1000"></PlaySheetList>
      </van-tab>
      <van-tab title="用户">
        <UserList :value="inputValue" :type="1002"></UserList>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import { usePlayId } from '@/store'
import { albumList, djRadio, PlaySheetList, singerList, singleSongs, UserList } from './index.js'
const store = usePlayId()

const inputValue = ref('')
const active = ref(0)

watch(active, (to) => {
  store.activeTab = to
})

watch(() => store.searchVal, (newv) => {
  inputValue.value = newv
})
</script>
<style lang="scss" scoped>
.search_wrap {
  padding: 0.266667rem;
}
</style>