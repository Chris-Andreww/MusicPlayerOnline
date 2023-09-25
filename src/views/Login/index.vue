<template>
  <div class='login'>
    <div class="inputBar" v-if="!qrImgUrl">
      <!-- 输入手机号 -->
      <div class="phoneInput">
        <label class="iconfont icon-shouji" for="phoneNum"></label>
        <input id="phoneNum" v-model="phoneNumber" placeholder="手机号" @input="limitToNumber">
      </div>
      <!-- 输入密码 -->
      <div class="passInput">
        <label class="iconfont icon-jiesuo" for="passNum"></label>
        <input id="passNum" type="password" v-model="password" placeholder="密码">
      </div>
    </div>
    <div class="qrImg" v-else>
      <img :src="qrImgUrl" @click="LoginWithQR">
      <p style="font-size: 16px;" v-html="notice"></p>
    </div>
    <div class="btn">
      <van-button class="button" round @click="LoginWithPass(phoneNumber, password)"
        color="linear-gradient(to right, #ff6034, #ee0a24)">密码登录</van-button>
      <van-button class="button" round @click="LoginWithQR"
        color="linear-gradient(to right, #ff6034, #ee0a24)">扫码登录</van-button>
    </div>
    <showToast ref="toast"></showToast>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { UserLoginAPI, makeQRCodekeyAPI, makeQRCodeAPI, checkQRCodeAPI } from '@/api';
import { usePlayId } from "@/store";
import { useRouter } from 'vue-router'

const phoneNumber = ref('')
const password = ref('')
const router = useRouter()
const store = usePlayId()
const toast = ref(null)
const qrImgUrl = ref('')
const notice = ref('等待扫码')
const checkInt = ref(null)  //用来循环检测二维码是否扫描，如果取消，则删除该定时器

//让手机号输入框只能输入数字
const limitToNumber = () => {
  // 使用正则表达式将非数字字符替换为空字符串
  phoneNumber.value = phoneNumber.value.replace(/\D+/g, '');
}

const LoginWithPass = async (phoneNumber, password) => {
  if (qrImgUrl.value) {
    qrImgUrl.value = ''
    clearInterval(checkInt.value)
    return
  }
  if (!phoneNumber || !password) {
    toast.value.trigger('手机号或密码不能为空！', 2000);
    return
  }
  let res = await UserLoginAPI(phoneNumber, password)
  if (res.data.code != 200) {
    toast.value.trigger('账号或密码错误！', 2000);
    return
  }
  store.uid = res.data.account.id
  router.push({
    path: '/layout/user'
  })
}

const LoginWithQR = async () => {
  let nowtime = Date.now();
  let key = await makeQRCodekeyAPI(nowtime)  //调第一个接口拿key
  let res = await makeQRCodeAPI(key.data.data.unikey) ////调第二个接口拿二维码图片
  qrImgUrl.value = res.data.data.qrimg
  // 800为二维码过期,801为等待扫码,802为待确认,803为授权登录成功
  //每三秒check一次
  checkInt.value = setInterval(async () => {
    let nowtime2 = Date.now();
    let res = await checkQRCodeAPI(key.data.data.unikey, nowtime2)
    if (res.data.code == 800) {
      notice.value = res.data.message + '<br>请点击二维码刷新'
      clearInterval(checkInt.value)
    }
    if (res.data.code == 801) {
      notice.value = res.data.message
    }
    if (res.data.code == 802) {
      notice.value = res.data.message
    }
    if (res.data.code == 803) {
      toast.value.trigger('登录成功！即将返回', 2000);
      clearInterval(checkInt.value)
      store.uid = res.data.code //用来触发用户页的刷新操作
      setTimeout(() => {
        router.push({
          path: '/layout/user'
        })
      }, 3000)
    }
  }, 3000)
}

</script>
<style scoped lang="scss">
.login {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 90%;
  width: 100%;
  box-sizing: border-box;
  padding: 100px 20px;
  position: absolute;

  .inputBar {
    font-size: 20px;

    .phoneInput {
      display: flex;
      padding: 20px;

      .iconfont {
        font-size: 30px;
        padding-right: 10px;
      }

      input {
        font-size: 20px;
        width: 100%;
        border: 0px;
        border-bottom: 2px solid rgb(197, 196, 196);
      }
    }

    .passInput {
      display: flex;
      padding: 20px;

      .iconfont {
        font-size: 30px;
        padding-right: 10px;
      }

      input {
        font-size: 20px;
        width: 100%;
        border: 0px;
        border-bottom: 2px solid rgb(197, 196, 196);
      }
    }
  }

  .qrImg {
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 40;

    img {
      width: 200px;
      height: 200px;
    }

    p {
      text-align: center;
    }
  }

  .btn {
    display: flex;
    flex-direction: column;
    height: 25%;

    .button {
      margin-top: 20px;
      font-size: 16px;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
