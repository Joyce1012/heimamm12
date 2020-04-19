<template>
  <div class="question">
    <el-card>
      <el-form :model="form" label-width="80px" ref="form">
        <el-row>
          <el-col :span="5">
            <el-form-item label="学科" prop="subject">
              <el-select placeholder="请选择学科" v-model="form.subject">
                <el-option
                  v-for="(item, index) in subjectData"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                  v-show="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="阶段" prop="step">
              <el-select placeholder="请选择阶段" v-model="form.step">
                <el-option
                  v-for="(value,key,index) in stepObj"
                  :key="index"
                  :label="value"
                  :value="+key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="企业" prop="enterprise">
              <el-select placeholder="请选择企业" v-model="form.enterprise">
                <el-option
                  v-for="(item, index) in businessData"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                  v-show="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="题型" prop="type">
              <el-select placeholder="请选择题型" v-model="form.type">
                <el-option
                  v-for="(value,key,index) in typeObj"
                  :key="index"
                  :label="value"
                  :value="+key"
                ></el-option>
                <!-- <el-option label="单选" :value="1"></el-option>
                <el-option label="多选" :value="2"></el-option>
                <el-option label="简答" :value="3"></el-option>-->
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="难度" prop="difficulty">
              <el-select placeholder="请选择难度" v-model="form.difficulty">
                <el-option
                  v-for="(value,key,index) in difficultyObj"
                  :key="index"
                  :label="value"
                  :value="+key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="作者" prop="username">
              <el-input v-model="form.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态" prop="status">
              <el-select placeholder="请选择状态" v-model="form.status">
                <el-option label="禁用" value="0"></el-option>
                <el-option label="启用" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="日期" prop="create_date">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.create_date"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label-width="10px">
              <el-button type="primary" @click="search">搜索</el-button>
              <el-button @click="reset">清除</el-button>
              <el-button type="primary" @click="add">+新增试题</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="content">
      <el-table :data="tableData" :border="true">
        <el-table-column label="序号">
          <template
            slot-scope="scope"
          >{{(pagination.currentPage-1)*pagination.pageSize+scope.$index+1}}</template>
        </el-table-column>
        <el-table-column label="题目">
          <template slot-scope="scope">
            <div v-html="scope.row.title"></div>
          </template>
        </el-table-column>
        <el-table-column label="学科.阶段 ">
          <template slot-scope="scope">{{scope.row.subject_name}}.{{stepObj[scope.row.step]}}</template>
        </el-table-column>
        <el-table-column label="题型 ">
          <template slot-scope="scope">{{typeObj[scope.row.type]}}</template>
        </el-table-column>
        <el-table-column label="企业" prop="enterprise_name"></el-table-column>
        <el-table-column label="创建者" prop="username"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{scope.row.status==0?'禁用':'启用'}}</template>
        </el-table-column>
        <el-table-column label="访问量" prop="reads"></el-table-column>
        <el-table-column label="操作" width="280px">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)">编辑</el-button>
            <el-button
              :type="scope.row.status==0?'success':'info'"
              @click="setStatus(scope.row.id)"
            >{{scope.row.status==0?'启用':'禁用'}}</el-button>
            <el-button @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.currentPage"
          :page-sizes="[5, 20, 30, 40]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        ></el-pagination>
      </div>
    </el-card>
    <addQuestion
      ref="addQuestion"
      :subjectData="subjectData"
      :businessData="businessData"
      :stepObj="stepObj"
      :difficultyObj="difficultyObj"
      :typeObj="typeObj"
      :mode="mode"
    ></addQuestion>
  </div>
</template>

<script>
import { getSubjectData } from "@/api/subject.js";
import { getBusinessDate } from "@/api/business.js";
import {
  getQuestionData,
  setQuestionData,
  delQuestionData
} from "@/api/question.js";
import addQuestion from "./addQuestion.vue";
export default {
  components: {
    addQuestion
  },
  data() {
    return {
      mode: "add",
      pagination: {
        currentPage: 1,
        pageSize: 5,
        total: 10
      },
      form: {
        title: "",
        subject: "",
        enterprise: "",
        type: "",
        step: "",
        username: "",
        status: "",
        difficulty: "",
        create_date: "",
        page: "",
        limit: ""
      },
      stepObj: { 1: "初级", 2: "中级", 3: "高级" },
      typeObj: { 1: "单选", 2: "多选", 3: "简答" },
      difficultyObj: { 1: "简单", 2: "一般", 3: "困难" },
      subjectData: [],
      businessData: [],
      tableData: []
    };
  },
  created() {
    getSubjectData({ limit: 1000 }).then(res => {
      this.subjectData = res.data.items;
    });
    getBusinessDate({ limit: 1000 }).then(res => {
      this.businessData = res.data.items;
    });
    this.getData();
  },
  methods: {
    getData() {
      let params = {
        page: this.pagination.currentPage,
        limit: this.pagination.pageSize,
        ...this.form
      };
      getQuestionData(params).then(res => {
        console.log("题库列表", res);
        this.tableData = res.data.items;

        this.tableData.forEach(item => {
          item.city = item.city.split(",");
          item.multiple_select_answer = item.multiple_select_answer.split(",");
        });
        this.pagination.total = res.data.pagination.total;
      });
    },
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.search();
    },
    handleCurrentChange(page) {
      this.pagination.currentPage = page;
      this.getData();
    },
    search() {
      console.log("所有数据", this.form);
      (this.pagination.currentPage = 1), this.getData();
    },
    reset() {
      this.$refs.form.resetFields();
      this.search();
    },
    add() {
      this.mode = "add";
      this.$refs.addQuestion.form = {
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
      };
      this.$refs.addQuestion.dialogVisible = true;
    },
    setStatus(id) {
      setQuestionData({ id }).then(() => {
        this.$message.success("设置状态成功");
        this.getData();
      });
    },
    del(id) {
      this.$confirm("您确定要删除此信息吗？", "友情提示", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消删除",
        type: "warning"
      })
        .then(() => {
          delQuestionData({ id }).then(() => {
            this.$message.success("删除成功");
            this.search();
          });
        })
        .catch(() => {
          // 点击取消处理
        });
    },
    edit(row) {
      console.log("整行数据", row);
      this.mode = "edit";
      this.$refs.addQuestion.form = JSON.parse(JSON.stringify(row));
      this.$refs.addQuestion.dialogVisible = true;
    }
  }
};
</script>

<style lang="less">
.question {
  .content {
    margin-top: 20px;
  }
  .pagination {
    text-align: center;
    margin-top: 20px;
  }
}
</style>