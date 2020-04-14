<template>
  <el-dialog class="addBusiness" :visible.sync="dialogVisible" width="600px">
    <div slot="title" class="title">{{mode=="add"?"新增企业":"编辑企业"}}</div>
    <el-form :model="form" label-width="100px" ref="form" :rules="rules">
      <el-form-item label="企业编码" prop="eid">
        <el-input v-model="form.eid"></el-input>
      </el-form-item>
      <el-form-item label="企业名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="企业简称" prop="short_name">
        <el-input v-model="form.short_name"></el-input>
      </el-form-item>
      <el-form-item label="企业简介" prop="intro">
        <el-input v-model="form.intro"></el-input>
      </el-form-item>
      <el-form-item label="企业备注" prop="remark">
        <el-input v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="footer">
      <el-button @click="dialogVisible=false">取消</el-button>
      <el-button type="primary" @click="submitClick">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addBusinessDate, editBusinessDate } from "@/api/business.js";
export default {
    props: ["mode"],
  data() {
    return {
      dialogVisible: false,
      rules: {
        eid: [{ required: true, message: "请填入企业编码", trigger: "blur" }],
        name: [{ required: true, message: "请填入企业名称", trigger: "blur" }],
        short_name: [
          { required: true, message: "请填入企业简称", trigger: "blur" }
        ],
        intro: [{ required: true, message: "请填入企业简介", trigger: "blur" }]
      },
      form: {
        eid: "",
        name: "",
        short_name: "",
        intro: "",
        remark: ""
      }
    };
  },
  methods: {
    submitClick() {
      this.$refs.form.validate(result => {
        console.log(result);
        if (result) {
          if (this.mode == "add") {
            addBusinessDate(this.form).then(() => {
              this.$message.success("添加成功");
              this.dialogVisible = false;
              this.$parent.search();
            });
          } else {
             editBusinessDate(this.form).then(() => {
              this.$message.success("编辑成功");
              this.dialogVisible = false;
              // 刷新企业列表
              this.$parent.search();
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
.addBusiness {
  .title {
    text-align: center;
    height: 53px;
    line-height: 53px;
    color: #fff;
    background: linear-gradient(
      225deg,
      rgba(17, 151, 251, 1),
      rgba(1, 198, 247, 1)
    );
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
  .footer {
    text-align: center;
  }
}
</style>