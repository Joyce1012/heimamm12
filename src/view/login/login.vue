<template>
  <div class="login">
    <div class="left">
      <div class="title">
        <img src="@/assets/img/loginlogo.png" alt />
        <span class="titleName">黑马面面</span>
        <span class="titleLine">|</span>
        <span class="titleName2">用户登录</span>
      </div>
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item prop="phone">
          <el-input prefix-icon="el-icon-user" v-model="form.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            :show-password="true"
            v-model="form.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row>
            <el-col :span="16">
              <el-input prefix-icon="el-icon-key" v-model="form.code" placeholder="请输入验证码"></el-input>
            </el-col>
            <el-col :span="8">
              <img :src="code" @click="codeClick" class="code" alt  />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.isCheck">
            我已阅读并同意
            <el-link type="primary">用户协议</el-link>和
            <el-link type="primary">隐私条款</el-link>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="btn" @click="loginClick">登录</el-button>
          <br />
          <el-button type="primary" class="btn" @click="registerClick">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="right">
      <img src="@/assets/img/login_banner_ele.png" alt />
    </div>

    <register ref="register"></register>
  </div>
</template>

<script>
import register from "./register.vue";
import { toLogin } from "@/api/login.js";
import { saveToken } from "@/utils/token.js"

export default {
  name: "login",
  components: {
    register
  },
  data() {
    return {
      code: process.env.VUE_APP_URL + "/captcha?type=login",
      // 表单绑定值
      form: {
        phone: "",
        password: "",
        code: "",
        isCheck: ""
      },
      rules: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "change" },
          {
            validator: (rule, value, callback) => {
              // 正则校验
              let _reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
              if (_reg.test(value)) {
                callback();
              } else {
                callback("请正确输入手机号");
              }
            }
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
          {
            min: 6,
            max: 12,
            message: "请输入6-12位长度密码",
            trigger: "change"
          }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "change" },
          { min: 4, max: 4, message: "请正确输入验证码", trigger: "change" }
        ],
        isCheck: [
          { required:true, message: "请勾选协议", trigger: "change"},
          {
            validator: (rule, value, callback) => {
              if (value === true) {
                callback();
              } else {
                callback("请勾选协议");
              }
            }
          }
        ]
      }
    };
  },
  methods: {
    loginClick() {
      // 登陆全局校验
      this.$refs.form.validate(result => {
        // this.$message.success(result + "");
        // 登陆接口调用
        if (result == true) {
          toLogin(this.form).then(res => {
            this.$message.success("登陆成功");
            console.log("登陆信息",res);
            // 保存token
            saveToken( res.data.token );
          }); 
        }
      });
    },
    registerClick() {
      this.$refs.register.dialogFormVisible = true;
    },

    codeClick(){
      this.code = process.env.VUE_APP_URL + "/captcha?type=login&t=" + Date.now();
    }
  }

  // mounted() {
  //   alert('')
  // },
};
</script>

<style lang="less">
.login {
  width: 1400px;
  height: 788px;
  display: flex;
  justify-content: space-around;
  align-items: center;
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
    .btn {
      width: 100%;
    }
    .btn:nth-child(1) {
      margin-bottom: 26px;
    }
    .code {
      width: 100%;
      height: 40px;
    }
    .title {
      margin-bottom: 20px;
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
}
</style>