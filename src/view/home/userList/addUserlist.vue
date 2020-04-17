<template>
  <el-dialog class="addUserList" :visible.sync="dialogVisible" width="600px">
    <h1 slot="title" class="title">{{mode=="add"?"新增用户":"编辑用户"}}</h1>
    <el-form :model="form" label-width="100px" ref="form" :rules="rules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role_id">
        <el-select v-model="form.role_id">
            <el-option
              v-for="(value,key,index) in $store.state.roleObj"
              :key="index"
              :label="value"
              :value="+key"
            ></el-option>
          </el-select>
      </el-form-item>
       <el-form-item label="状态" prop="status">
         <el-select v-model="form.status">
           <el-option label="启用" :value="1"></el-option>
           <el-option label="禁用" :value="0"></el-option>
         </el-select>
      </el-form-item>
      <el-form-item label="用户备注" prop="remark">
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
import { addUserData, editUserData } from "@/api/user.js";
export default {
    props: ["mode","editData"],
  data() {
    return {
      dialogVisible: false,
      rules: {
        username: [{ required: true, message: "请填写用户名", trigger: "blur" }],
        email: [{ required: true, message: "请填写邮箱", trigger: "blur" },
        {
          validator:(rule,value,callback)=>{
            let reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
            if(reg.test(value)) {
              callback();
            }else {
              callback("请正确输入邮箱")
            }
          },
          trigger: "change"
        }
        ],
        phone: [
          { required: true, message: "请填写电话", trigger: "blur" },
          {
          validator:(rule,value,callback)=>{
            let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
            if(reg.test(value)) {
              callback();
            }else {
              callback("请正确输入手机")
            }
          },
          trigger: "change"
        }
        ],
        role_id: [{ required: true, message: "请选择角色", trigger: "change" }]
      },
      form: {
        username: "",
        phone: "",
        email: "",
        role_id: "",
        remark: "",
        status: ""
      }
    };
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal == true) {
        this.$nextTick(()=>{
          this.$refs.form.clearValidate();
        });
      }
    }
  },

  methods: {
    submitClick() {
      this.$refs.form.validate(result => {
        console.log(result);
        if (result) {
          if (this.mode == "add") {
         
            addUserData(this.form).then(() => {
              this.$message.success("新增成功");
              this.dialogVisible = false;
              this.$parent.search();
            });
          } else {
             editUserData(this.form).then(() => {
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
.addUserList {
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