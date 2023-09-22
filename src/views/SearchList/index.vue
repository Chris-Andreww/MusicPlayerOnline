<template>
  <div class="search_wrap">
    <van-tabs v-model:active="active">
      <van-tab title="单曲">
        <singleSongs :type="1"></singleSongs>
      </van-tab>
      <van-tab title="专辑">
        <albumList :type="10"></albumList>
      </van-tab>
      <van-tab title="播客">
        <djRadio :type="1009"></djRadio>
      </van-tab>
      <van-tab title="歌手">
        <singerList :type="100"></singerList>
      </van-tab>
      <van-tab title="歌单">
        <PlaySheetList :type="1000"></PlaySheetList>
      </van-tab>
      <van-tab title="用户">
        <UserList :type="1002"></UserList>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { albumList, djRadio, PlaySheetList, singerList, singleSongs, UserList } from './index.js'

const active = ref(0)
</script>
<style lang="scss" scoped>
.search_wrap {
  padding: 0.266667rem;
}
</style>