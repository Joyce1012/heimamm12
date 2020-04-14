<template>
  <el-dialog class="addSubject" :visible.sync="dialogFormVisible" width="600px">
    <div slot="title" class="title">{{mode=="add"?"新增学科":"编辑学科"}}</div>
    <el-form label-width="95px" :model="form" ref="form" :rules="rules">
      <el-form-item label="学科编码" prop="rid">
        <el-input v-model="form.rid"></el-input>
      </el-form-item>
      <el-form-item label="学科名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="学科简称" prop="short_name">
        <el-input v-model="form.short_name"></el-input>
      </el-form-item>
      <el-form-item label="学科简介" prop="intro">
        <el-input v-model="form.intro"></el-input>
      </el-form-item>
      <el-form-item label="学科备注" prop="remark">
        <el-input v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="footer">
      <el-button @click="dialogFormVisible=false">取消</el-button>
      <el-button type="primary" @click="submitClick">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addSubjectData, editdSubjectData } from "@/api/subject.js";

export default {
  props: {
    mode: {
      type: String,
      default: "add"
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        rid: "",
        name: "",
        short_name: "",
        intro: "",
        remark: ""
      },
      rules: {
        rid: [{ required: true, message: "请填入学科编号", trigger: "blur" }],
        name: [{ required: true, message: "请填入学科名称", trigger: "blur" }]
      }
    };
  },
  watch: {
    dialogFormVisible(newVal) {
      if (newVal == false) {
        this.$refs.form.resetFields();
      }
    }
    },
//     mode() {
//       this.$nextTick(() => {
//         this.$refs.form.clearValidate();
//       });
//     }
//   

  methods: {
    submitClick() {
      this.$refs.form.validate(result => {
        console.log(result);
        if (result) {
          if (this.mode == "add") {
            addSubjectData(this.form).then(() => {
              this.$message.success("新增成功");
              this.dialogFormVisible = false;
              //   this.$parent.search();
              this.$emit("add");
            });
          } else {
            editdSubjectData(this.form).then(() => {
              this.$message.success("编辑成功");
              this.dialogFormVisible = false;
              this.$emit("add");
            });
          }
        }
      });
    }
  }
  }
</script>

<style lang="less">
.addSubject {
  .title {
    text-align: center;
    color: #fff;
    background: linear-gradient(
      225deg,
      rgba(17, 151, 251, 1),
      rgba(1, 198, 247, 1)
    );
    height: 53px;
    line-height: 53px;
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