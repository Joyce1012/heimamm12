<template>
  <el-dialog :visible.sync="dialogFormVisible" class="register" width="600px" :show-close="false">
    <div slot="title" class="title">用户注册</div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogFormVisible: false
    };
  }
};
</script>

<style lang="less">
.register {
  .title {
    height: 53px;
    background: linear-gradient(
      225deg,
      rgba(17, 151, 251, 1),
      rgba(1, 198, 247, 1)
    );
    color: #fff;
    text-align: center;
    line-height: 53px;
  }
  .el-dialog__header {
      padding: 0;
  }
}
</style>