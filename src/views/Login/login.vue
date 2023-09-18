<template>
  <div class='login'>
    <el-dialog width="30%">
      <div class="login-wrapper">
        <el-form>
          <el-form-item prop="phone" label-width="">
            <el-input placeholder="请输入网易云帐号登录">
            </el-input>
          </el-form-item>
          <el-form-item prop="pwd" label-width="">
            <el-input placeholder="请输入密码" show-password>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" >登录</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {

}
</script>
<style scoped lang="less">
.login-logo {
  display: block;
  margin: 0 auto 50px;
}

.login {

  :deep(.el-dialog__body) {
    padding: 30px 20px 0;
  }

  .dialog-footer {
    position: relative;
    z-index: 2;
    display: block;
    width: 100%;
    margin-bottom: 120px;

    .el-button {
      width: 100%;
    }
  }

  :deep(.el-dialog__footer) {
    position: relative;

    &:after {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      content: "";
      width: 100%;
      height: 100%;
      opacity: .3;
      background: url('@assets/img/login_bg2.jpg') center bottom no-repeat;
      background-size: contain;
    }
  }
}
</style>
