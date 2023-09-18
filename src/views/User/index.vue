<template>
  <div class="user-page">
    <img :src="user.avatar" :alt="user.username" class="avatar">
    <h1 class="username">{{ user.username }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        avatar: 'path_to_avatar_image',
        username: 'User123'
      }
    };
  }
};
</script>

<style scoped>
.user-page {
  text-align: center;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.username {
  font-size: 24px;
  margin-top: 20px;
}
</style>