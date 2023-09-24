<template>
  <div class='login'>
    <div class="inputBar">
      <!-- 输入手机号，调起手机号键盘 -->
      <input type="tel" v-model="phoneNumber" placeholder="手机号" @input="limitToNumber">
      <div class="iconfont icon-shouji" style="font-size: 20px;"></div>
      <!-- 输入密码 -->
      <input type="password" v-model="password" placeholder="密码">
      <div class="iconfont icon-jiesuo"></div>
    </div>
    <van-button class="button" round @click="Login(phoneNumber, password)"
      color="linear-gradient(to right, #ff6034, #ee0a24)">确认提交</van-button>
  </div>
  <div class="errorToast">账号或密码错误！</div>
</template>

<script setup>
import { ref } from 'vue';
import { UserLoginAPI } from '@/api';
import { usePlayId } from "@/store";
import { useRouter } from 'vue-router'

const phoneNumber = ref('')
const password = ref('')
const router = useRouter()
const store = usePlayId()

//让手机号输入框只能输入数字
const limitToNumber = ()=>{
  // 使用正则表达式将非数字字符替换为空字符串
  phoneNumber.value = phoneNumber.value.replace(/\D+/g, '');
}

const Login = async (phoneNumber, password) => {
  let res = await UserLoginAPI({ phoneNumber, password })
  if (res.data.code != 200) {
    let elem = document.querySelector('.errorToast')
    elem.classList.add('fadein')
    setTimeout(() => {
      elem.classList.remove('fadein')
    }, 2000)
    return
  }
  store.uid = res.data.account.id
  router.push({
    path: '/layout/user'
  })
}

</script>
<style scoped lang="scss">
.login {
  height: 300px;
  padding: 100px 20px;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .inputBar {
    font-size: 20px;
  }

  .button {
    margin-top: 10%;
    font-size: 16px;
    width: 100%;
  }
}

.errorToast {
  position: fixed;
  transform: translateX(-50%);
  font-size: 20px;
  padding: 10px 20px;
  width: 50%;
  color: white;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.8);
  left: 50%;
  top: 20%;
  opacity: 0;

  transition: opacity 1s;

  &.fadein {
    opacity: 1;
  }
}
</style>
