<template>
  <el-dialog :visible.sync="dialogFormVisible" class="register" width="600px" :show-close="false">
    <!-- 上传东西
            el-upload
           1:上传地址  action
           2：参数     name="值" 该值就是上传文件的参数
           3:是否显示已上传文件列表    show-file-list 
           4:上传成功的回调函数   on-success
              成功回调函数里面有个res就是接口返回信息
              上传成功后须在form表单数据里面保存一下该图像avatar值
           5：上传前的处理（还没调用上传接口前的处理）       before-upload
              上传前处理它有一个file文件信息，通过file文件信息能够限制上传格式（file.type），大小等控制  (file.size以字节)
              该回调函数return的值就是控制让不让你通过  true通过  false不通过

    -->
    <el-form :model="form" label-width="100px" ref="form" :rules="rules">
      <div slot="title" class="title">用户注册</div>
      <el-form-item label="头像" prop="avatar">
        <el-upload
          name="image"
          class="avatar-uploader"
          :action="baseURL+'/uploads'"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="昵称" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="图形码" prop="code">
        <el-row>
          <el-col :span="16">
            <el-input v-model="form.code"></el-input>
          </el-col>
          <el-col :span="7" :offset="1">
            <img class="code" :src="codeUrl" @click="changeCodeUrl" alt />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="验证码" prop="rcode">
        <el-row>
          <el-col :span="16">
            <el-input v-model="form.rcode"></el-input>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-button @click="getRcode" :disabled="totalTime != 60">
              获取验证码
              <span v-if="totalTime != 60">{{totalTime}}</span>
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div slot="footer" class="center">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="submitClick">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getPhoneCode, register } from "@/api/register.js";
export default {
  data() {
    return {
      dialogFormVisible: false,
      baseURL: process.env.VUE_APP_URL,
      imageUrl: "",
      totalTime: "60",
      codeUrl: process.env.VUE_APP_URL + "/captcha?type=sendsms",
      form: {
        avatar: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        code: "",
        rcode: ""
      },
      rules: {
        avatar: [{ required: true, message: "请上传头像", trigger: "change" }],
        username: [
          { required: true, message: "请填写昵称", trigger: "change" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "change" },
          {
            validator: (rule, value, callback) => {
              let _reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
              if (_reg.test(value)) {
                callback();
              } else {
                callback("请正确输入邮箱地址");
              }
            }
          }
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "change" },
          {
            validator: (rule, value, callback) => {
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
          { required: true, message: "请输入图形验证码", trigger: "change" },
          {
            min: 4,
            max: 4,
            message: "请正确输入图形验证码",
            trigger: "change"
          }
        ],
        rcode: [
          { required: true, message: "请输入手机验证码", trigger: "change" },
          {
            min: 4,
            max: 4,
            message: "请正确输入验证码",
            trigger: "change"
          }
        ]
      }
    };
  },

watch: {
  dialogFormVisible(newVal) {
    if(newVal == false) {
      this.$refs.form.resetFields();
      this.imageUrl = "";
    }
  }
},

  methods: {
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/git";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleAvatarSuccess(res) {
      //  this.imageUrl = URL.createObjectURL(file.raw);
      this.imageUrl = this.baseURL + "/" + res.data.file_path;
      this.form.avatar = res.data.file_path;
      // 上传成功，主动触发验证
      this.$refs.form.validateField("avatar");
    },
    submitClick() {
      this.$refs.form.validate(result => {
        window.console.log(result);
        if (result) {
          register(this.form).then(res => {
            console.log("注册返回信息", res);
            this.$message.success("注册成功");
            this.dialogFormVisible = false;
          });
        }
      });
    },
    // 点击切换验证码
    changeCodeUrl() {
      this.codeUrl =
        process.env.VUE_APP_URL + "/captcha?type=sendsms&t=" + Date.now();
    },

    getRcode() {
      let pass = true;
      this.$refs.form.validateField(["code", "phone"], error => {
        if (error != "") {
          pass = false;
        }
      });

      if (pass === false) {
        return;
      } else {
        this.totalTime--;
        let timer = setInterval(() => {
          this.totalTime--;
          if (this.totalTime <= 0) {
            clearInterval(timer);
            this.totalTime = 60;
          }
        }, 1000);
        getPhoneCode({
          code: this.form.code,
          phone: this.form.phone
        }).then(res => {
          this.$message.success(res.data.captcha + "");
          console.log(res);
        });
      }
    }
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
  .avatar-uploader {
    width: 178px;
    margin: 0 auto;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .code {
    width: 100%;
    height: 40px;
    border: 1px dashed #ccc;
  }
}
</style>