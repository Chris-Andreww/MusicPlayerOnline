<div class="userinfo">
  <img :src="userProfile.avatarUrl" class="avatar">
  <div class="username">{{ userProfile.nickname }}</div>
  <div class="userfans">关注：{{ userProfile.follows }} &nbsp;| &nbsp;粉丝：{{ userProfile.followeds }}</div>
  <div class="userlevel">Lv.{{ userData.level }}</div>
</div>