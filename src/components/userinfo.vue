<template>
  <div class="userinfo">
    <img :src="userProfile?.avatarUrl" class="avatar">
    <div class="username">{{ userProfile.nickname }}</div>
    <div class="userfans">关注：{{ userProfile.follows }} &nbsp;| &nbsp;粉丝：{{ userProfile.followeds }}</div>
    <div class="userlevel">Lv.{{ userData.level }}</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  userProfile: Object,
  userData: Object
})
</script>
<style scoped>
.userinfo {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: start;

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }

  .username {
    font-size: 20px;
    margin-top: 10px;
  }

  .userfans {
    font-size: 16px;
  }

  .userlevel {
    font-size: 14px;
    background-color: #8779764b;
    padding: 2px 8px;
    border-radius: 20px;
  }
}
</style>