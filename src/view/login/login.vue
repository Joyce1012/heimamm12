<template>
  <div class="login">
    <div class="left">
      <div class="title">
        <img src="@/assets/img/loginlogo.png" alt />
        <span class="titleName">黑马面面</span>
        <span class="titleLine">|</span>
        <span class="titleName2">用户登录</span>
      </div>
    </div>
    <div class="right">
      <img src="@/assets/img/login_banner_ele.png" alt />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less">
.login {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  background: linear-gradient(
    225deg,
    rgba(20, 147, 250, 1),
    rgba(1, 198, 250, 1)
  );
  .left {
    width: 478px;
    height: 550px;
    background: rgba(245, 245, 245, 1);
    padding: 43px;
    .titleName {
      width: 94px;
      height: 22px;
      font-size: 24px;
      font-weight: 400;
      color: rgba(12, 12, 12, 1);
      margin-left: 15px;
      margin-right: 15px;
    }
    .titleLine {
      color: #ccc;
      font-size: 24px;
    }
    .titleName2 {
      width: 87px;
      height: 21px;
      font-size: 22px;
      font-weight: 400;
      color: rgba(12, 12, 12, 1);
      margin-left: 15px;
    }
  }
}
</style>