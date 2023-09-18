<template>
  <div>
    <p class="title">推荐歌单</p>
    <van-row gutter="6">
      <van-col span="8" v-for="obj in reList" :key="obj.id">
        <van-image width="100%" height="3rem" fit="cover" :src="obj.picUrl" />
        <p class="song_name">{{ obj.name }}</p>
      </van-col>
    </van-row>
  </div>
  <p class="title">最新音乐</p>
  <SongItem v-for="obj in songList" :key="obj.id" :name="obj.name" :author="obj.song.artists[0].name" :id="obj.id">
  </SongItem>
</template>

<style scoped>
p {
  font-size: 16px;
}
</style>

<script>
import { recommendMusicAPI, newMusicAPI } from "@/api";
export default {
  data () {
    return {
      reList: [], // 推荐歌单数据
      songList: [], // 最新音乐数据
    };
  },
  async created () {
    const res = await recommendMusicAPI({
      limit: 6,
    });
    this.reList = res.data.result;

    const res2 = await newMusicAPI({
      limit: 20
    })
    this.songList = res2.data.result
  },
};
</script>
