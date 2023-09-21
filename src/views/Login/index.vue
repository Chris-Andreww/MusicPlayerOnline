<template>
  <div class='login'>
    <div class="inputBar">
      <van-cell-group inset>
        <!-- 输入手机号，调起手机号键盘 -->
        <van-field v-model="phone" type="tel" label="手机号：" label-align="center" placeholder="请输入手机号">
          <template #left-icon>
            <div class="iconfont icon-shouji" style="font-size: 20px;"></div>
          </template>
        </van-field>
        <!-- 输入密码 -->
        <van-field v-model="password" type="password" label="密码：" label-align="center" placeholder="请输入密码">
          <template #left-icon>
            <div class="iconfont icon-jiesuo"></div>
          </template>
        </van-field>
      </van-cell-group>
    </div>
    <van-button class="button" round @click="Login(phone, password)"
      color="linear-gradient(to right, #ff6034, #ee0a24)">确认提交</van-button>
  </div>
  <div class="errorToast">账号或密码错误！</div>
</template>

<script setup>
import { ref } from 'vue';
import { UserLoginAPI } from '@/api';
import { usePlayId } from "@/store";
import { useRouter } from 'vue-router'

const phone = ref('')
const password = ref('')
const router = useRouter()
const store = usePlayId()

const Login = async (phone, password) => {
  let res = await UserLoginAPI({ phone, password })
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
