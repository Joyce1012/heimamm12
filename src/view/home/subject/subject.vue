<template>
  <div class="subject">
    <el-card>
      <el-form :model="form" label-width="90px" :inline="true" ref="form">
        <el-form-item label="学科编号" prop="rid">
          <el-input class="setWidth" @keyup.enter="search" v-model="form.rid"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="name">
          <el-input class="setWidth" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="username">
          <el-input class="setWidth" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select class="setWidth" placeholder="请选择状态" v-model="form.status">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" >搜索</el-button>
          <el-button @click="reset">清除</el-button>
          <el-button type="primary" @click="add">+新增学科</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData">
        <el-table-column label="序号" width="50px">
          <template slot-scope="scope">{{(pagination.currentPage-1)*pagination.pageSize+scope.$index+1}}</template>
        </el-table-column>
        <el-table-column label="学科编号 " prop="rid"></el-table-column>
        <el-table-column label="学科名称 " prop="name"></el-table-column>
        <el-table-column label="简称" prop="short_name"></el-table-column>
        <el-table-column label="创建者 " prop="username"></el-table-column>
        <el-table-column label="创建日期 " prop="create_time"></el-table-column>
        <el-table-column label="状态" width="100px">
          <template slot-scope="scope">{{scope.row.status==1?'启用':'禁用'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="270px">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)">编辑</el-button>
            <el-button @click="setStatus(scope.row.id)">{{scope.row.status==0?'启用':'禁用'}}</el-button>
            <el-button @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.currentPage"
          :page-sizes="[3, 20, 30, 40]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        ></el-pagination>
      </div>
    </el-card>
    <addSubject ref="addSubject" @add="search" :mode="mode"> </addSubject>

  </div>
</template>

<script>

import { 
getSubjectData,
setSubjectStatus,
delSubjectData
 } from "@/api/subject.js";
// 导入新增组件
 import addSubject from "./addSubject.vue"

export default {
   components:{
      addSubject,
    },
  data() {
    return {
      mode:"add", //add新增，edit编辑
      pagination: {
        pageSize: 3,
        currentPage: 1,
        total: 40
      },
      tableData: [],
      form: {
        rid: "",
        name: "",
        username: "",
        status: ""
      }
    };
  },
  methods: {
    getData() {
      let params = {
        page: this.pagination.currentPage, //当前页码
        limit: this.pagination.pageSize, //页容量
        ...this.form
      };
      getSubjectData(params).then(res => {
        this.tableData = res.data.items;
        console.log(res);
        this.pagination.total = res.data.pagination.total;
      });
    },
    // 设置状态
    setStatus(id) {
    setSubjectStatus({id:id}).then(()=>{
      this.$message.success("设置状态成功");
      this.search();
    });
  },

    // 页容量改变时
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.pagination.currentPage = 1;
      this.getData();
    },
    // 页码改变时
    handleCurrentChange(page) {
      this.pagination.currentPage = page;
      this.getData();
    },
    search() {
      this.pagination.currentPage = 1;
      this.getData();
    },
    reset(){
      this.$refs.form.resetFields();
      /*
       this.form= {
        rid: "",
        name: "",
        username: "",
        status: ""
      }
      */
    //  调用搜索
    this.search();
    },

    // 删除功能
    del(id){
      this.$confirm("您确定要删除此条数据吗？","删除",{
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        delSubjectData({id:id}).then(()=>{
          this.$message.success("删除成功");
          // 调用搜索更新数据
          this.search();
        });
      }).catch(()=>{
        // 点击取消处理
      });
    },

    add(){
      this.mode = "add";
      this.$refs.addSubject.form = {
        rid: "", //学科编号
        name: "", //学科名称
        short_name: "", //学科简称
        intro: "", //学科简介
        remark: "" //学科备注
      };
      this.$refs.addSubject.dialogFormVisible = true;
    },
    edit(row){
      console.log(row);
      this.mode = "edit";
      // 通过ref属性修改addSubject组件的form表单值
      this.$refs.addSubject.form = JSON.parse(JSON.stringify(row));
      this.$refs.addSubject.dialogFormVisible = true;
    }

  },


  created() {
    this.getData();
  }
};
</script>

<style lang="less">
.subject {
  .setWidth {
    width: 120px;
  }
  .pagination {
    text-align: center;
    margin-top: 30px;
  }
}
</style>