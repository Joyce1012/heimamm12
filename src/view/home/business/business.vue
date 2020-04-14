<template>
  <div class="business">
    <el-card>
      <el-form :model="form" :inline="true" ref="form">
        <el-form-item label="企业编号" prop="eid">
          <el-input class="setWidth" v-model="form.eid"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input class="setWidth" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="username">
          <el-input class="setWidth" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select class="setWidth" v-model="form.status">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="reset">清除</el-button>
          <el-button type="primary" @click="add">+新增企业</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="tableCard">
      <el-table :data="tableData">
        <el-table-column label="序号" width="80px">
          <template
            slot-scope="scope"
          >{{(pagination.currentPage-1)*pagination.pageSize+scope.$index+1}}</template>
        </el-table-column>
        <el-table-column label="企业编号" width="150px" prop="eid"></el-table-column>
        <el-table-column label="企业名称" prop="name"></el-table-column>
        <el-table-column label="创建者" prop="username"></el-table-column>
        <el-table-column label="创建时间" prop="create_time"></el-table-column>
        <el-table-column label="状态" width="100px">
          <template slot-scope="scope">
            <div :class="{red:scope.row.status==0}">{{scope.row.status==1?'启用':'禁用'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280px">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)">编辑</el-button>
            <el-button
              plain
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
          :page-sizes="[2, 20, 30, 40]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        ></el-pagination>
      </div>
    </el-card>
    <addBusiness ref="addBusiness" :mode="modeFather"></addBusiness>
  </div>
</template>

<script>
import addBusiness from "./addBusiness.vue";
import {
  getBusinessDate,
  delBusinessDate,
  setBusinessStatus
} from "@/api/business.js";
export default {
  components: {
    addBusiness
  },
  data() {
    return {
      modeFather:"add",
      form: {
        name: "",
        eid: "",
        username: "",
        status: ""
      },
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 2,
        total: 10
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      let params = {
        page: this.pagination.currentPage,
        limit: this.pagination.pageSize,
        ...this.form
      };
      getBusinessDate(params).then(res => {
        console.log("企业列表", res);
        this.tableData = res.data.items;
        this.pagination.total = res.data.pagination.total;
      });
    },

    handleSizeChange(val) {
      this.pagination.pageSize = val;
      console.log(`每页 ${val} 条`);
      this.search();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getData();
      console.log("当前页：${val}");
    },
    search() {
      this.pagination.currentPage = 1;
      this.getData();
      console.log(this.form);
    },
    reset() {
      this.$refs.form.resetFields();
      this.search();
    },
    add() {
      this.modeFather = "add";
      this.$refs.addBusiness.form = {
        eid: "",
        name: "",
        short_name: "",
        intro: "",
        remark: ""
      }
      this.$refs.addBusiness.dialogVisible = true;
    },
    del(id) {
      this.$confirm("你确定要删除该条信息吗？", "友情提示", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消操作",
        type: "warning"
      }).then(() => {
        // 确定删除调用接口
        delBusinessDate({ id }).then(() => {
          this.$message.success("删除成功");
          this.search();
        });
      }).catch(()=>{

      });
    },
    setStatus(id) {
      setBusinessStatus({ id }).then(() => {
        this.$message.success("状态修改成功");
        this.search();
      });
    },
    edit(row){
      this.modeFather = "edit";
      this.$refs.addBusiness.form = JSON.parse(JSON.stringify(row));
      this.$refs.addBusiness.dialogVisible = true;
      console.log(row);
    }
  }
};
</script>

<style lang="less">
.business {
  .setWidth {
    width: 150px;
    height: 39px;
    border: 1px solid rgba(224, 227, 233, 1);
    border-radius: 4px;
  }
  .tableCard {
    margin-top: 30px;

    .pagination {
      text-align: center;
      margin-top: 30px;
    }
    .red {
      color: red;
    }
  }
}
</style>