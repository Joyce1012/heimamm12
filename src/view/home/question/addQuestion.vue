<template>
  <!-- 
    el-dialog    visible.syna显示        width属性   fullscreen是否全屏，默认不全屏
      slot="title/footer" 重写标题与底部按钮
  -->
  <el-dialog :visible.sync="dialogVisible" :fullscreen="true" class="addQuestion">
    <div slot="title" class="title">新增题库测试</div>
    <el-form :model="form" class="form" label-width="120px" :rules="rules" ref="form">
      <el-form-item label="学科" prop="subject">
        <el-select placeholder="请选择学科" v-model="form.subject" class="select">
          <el-option
            v-for="(item, index) in subjectData"
            :key="index"
            :label="item.name"
            :value="item.id"
            v-show="item.status==1"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="阶段" prop="step">
        <el-select placeholder="请选择阶段" v-model="form.step" class="select">
          <el-option v-for="(value,key,index) in stepObj" :key="index" :label="value" :value="+key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="企业" prop="enterprise">
        <el-select placeholder="请选择企业" v-model="form.enterprise" class="select">
          <el-option
            v-for="(item, index) in businessData"
            :key="index"
            :label="item.name"
            :value="item.id"
            v-show="item.status==1"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="城市" prop="city">
        <el-cascader v-model="form.city" :options="options" :props="{value:'label'}"></el-cascader>
      </el-form-item>
      <el-form-item label="题型" prop="type">
        <el-radio-group v-model="form.type">
          <!-- label代表值 -->
          <el-radio v-for="(value,key,index) in typeObj" :key="index" :label="+key">{{value}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="难度" prop="difficulty">
        <el-radio-group v-model="form.difficulty">
          <!-- label代表值 -->
          <el-radio v-for="(value,key,index) in difficultyObj" :key="index" :label="+key">{{value}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <hr />
      <el-form-item label="试题标题" prop="title" class="setMargin">
        <quillEditor
          v-model="form.title"
          :options="{placeholder:'请在这里输入'}"
          @change="editorChange('title')"
        ></quillEditor>
      </el-form-item>
      <el-form-item
        :label="typeObj[form.type]"
        :prop="{1: 'single_select_answer', 2: 'multiple_select_answer', 3: 'short_answer'}[form.type]"
      >
        <!-- 
          功能东西都较多，我们可以抽离成一个组件        
        -->
        <!-- 对象传递：子组件将会和父组件数据统一，子组件里面数据变了，父组件也会变 -->
        <allSelect :form="form" class="allselect" @change="allSelectChange"></allSelect>
      </el-form-item>
      <hr class="hrMargin" />
      <el-form-item label="解析视频">
        <uploadFile v-model="form.video" type="video"></uploadFile>
      </el-form-item>
      <hr class="hrMargin" />
      <el-form-item label="答案解析" prop="answer_analyze" class="setMargin">
        <quillEditor
          v-model="form.answer_analyze"
          :options="{placeholder:'请在这里输入'}"
          @change="editorChange('answer_analyze')"
        ></quillEditor>
      </el-form-item>
      <hr class="hrMargin" />
      <el-form-item label="试题备注" prop="remark">
        <el-input type="textarea" rows="4" v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="footer">
      <el-button @click="dialogVisible=false">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
// import导入的数据不能直接到html里面使用
import { regionData } from "element-china-area-data";
// 导入富文本组件
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import allSelect from "./allSelect";
import uploadFile from "./uploadFile";
import { addQuestionData, editQuestionData } from "@/api/question.js";

export default {
  props: [
    "subjectData",
    "stepObj",
    "businessData",
    "typeObj",
    "difficultyObj",
    "mode"
  ],
  watch: {
    dialogVisible(val) {
      if (val == true) {
        this.$nextTick(()=>{
          //清空验证
          this.$refs.form.clearValidate();
        })
    }
    }
  },
  components: {
    quillEditor,
    allSelect,
    uploadFile
  },
  data() {
    return {
      dialogVisible: false,
      options: regionData,
     rules: {
        subject: [{ required: true, message: "请选择学科", trigger: "change" }], //学科
        step: [{ required: true, message: "请选择阶段", trigger: "change" }], //阶段
        enterprise: [
          { required: true, message: "请选择企业", trigger: "change" }
        ], //企业
        city: [{ required: true, message: "请选择城市", trigger: "change" }], //城市
        type: [{ required: true, message: "请选择题型", trigger: "change" }], //题型
        difficulty: [
          { required: true, message: "请选择难度", trigger: "change" }
        ], //难度
        title: [{ required: true, message: "请输入题目", trigger: "change" }], //题目
        single_select_answer: [
          { required: true, message: "请选择单选答案", trigger: "change" }
        ], //单选答案
        multiple_select_answer: [
          { required: true, message: "请选择多选答案", trigger: "change" }
        ], //多选答案
        short_answer: [
          { required: true, message: "请输入简答答案", trigger: "change" }
        ], //简答答案
        answer_analyze: [
          { required: true, message: "请输入答案解析", trigger: "change" }
        ], //答案解析
        remark: [
          { required: true, message: "请输入试题备注", trigger: "change" }
        ] //试题备注
      },
      form: {
        subject: "", //学科
        step: "", //阶段
        enterprise: "", //企业
        city: [], //城市
        type: 1, //题型
        difficulty: 1, //难度
        title: "",
        single_select_answer: "", //单选答案
        multiple_select_answer: [], //多选答案
        short_answer: "", //简答答案
        video: "", //解析视频地址
        answer_analyze: "",
        remark: "",
        select_options: [
          {
            label: "A",
            text: "狗不理",
            image: ""
          },
          {
            label: "B",
            text: "猫不理",
            image: ""
          },
          {
            label: "C",
            text: "麻花",
            image: ""
          },
          {
            label: "D",
            text: "炸酱面",
            image: ""
          }
        ]
      }
     
    };
  },
  methods: {
    submit() {
      this.$refs.form.validate(result => {
        if (result) {
          if (this.mode == "add") {
            addQuestionData(this.form).then(() => {
              this.$message.success("添加成功！");
              this.dialogVisible = false;
              this.$parent.search();
            });
          } else {
            let query = JSON.parse(JSON.stringify(this.form));
            query.city = query.city.join(",");
            editQuestionData(query).then(() => {
              this.$message.success("编辑成功！");
              this.dialogVisible = false;
              this.$parent.getData();
            });
          }
        }
        window.console.log(this.form.short_answer);
      });
    },
    editorChange(str) {
      this.$refs.form.validateField(str);
    },
    allSelectChange() {
      this.$refs.form.validateField([
        "single_select_answer",
        "multiple_select_answer",
        "short_answer"
      ]);
    }
  }
};
</script>
<style lang="less">
.addQuestion {
  .el-dialog__header {
    padding: 0;
  }
  .allselect {
    .el-input__inner {
      border-color: #dcdfe6;
    }
  }
  .el-form-item__label {
    text-align: left;
  }
  .setMargin {
    .el-form-item__content {
      margin-left: 0px !important;
      margin-top: 40px;
    }
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
  .title {
    color: #fff;
    padding-left: 15px;
    height: 54px;
    line-height: 54px;
    background-color: rgb(4, 188, 250);
  }
  .footer {
    text-align: center;
  }
  .form {
    width: 832px;
    margin: 0 auto;
    .select {
      width: 300px;
    }
  }
  .hrMargin {
    margin-bottom: 30px;
  }
}
</style>