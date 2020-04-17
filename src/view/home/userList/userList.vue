<template>
  <div class="userList">
    <el-card class="header">
      <el-form :model="form" :inline="true" class="form">
        <el-form-item label="用户名称" prop="username">
          <el-input class="setWidth" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input class="setWidth" v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select class="setWidth" v-model="form.role_id">
            <el-option
              v-for="(value,key,index) in $store.state.roleObj"
              :key="index"
              :label="value"
              :value="key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="search" >搜索</el-button>
          <el-button @click="reset">清除</el-button>
          <el-button type="primary" @click="add">+新增用户</el-button>
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
        <el-table-column label="用户名" width="150px" prop="username"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="角色" prop="role"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="状态" width="100px" prop="status">
          <template slot-scope="scope">
            <div @click="setStatus(scope.row.id)" :class="{red:scope.row.status==0}">{{scope.row.status==1?'启用':'禁用'}}</div>
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
    <addUserList ref="addUserList" :mode="mode" :editData="editData"></addUserList>
  </div>
</template>

<script>
import addUserList from "./addUserList.vue";
import {
  getUserListDate,
  delUserData,
  setUserStatus
} from "@/api/user.js";

export default {
  components: {
    addUserList
  },
  data() {
    return {
      mode:"add",
      editData: "editData",
      form: {
        username: "",
        email: "",
        role_id: "",
        
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
      getUserListDate(params).then(res => {
        console.log("用户列表", res);
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
      this.mode = "add";
      this.$refs.addUserList.form = {
        username: "",
        phone: "",
        email: "",
        role_id: "",
        remark: "",
        status: ""
      };
      this.$refs.addUserList.dialogVisible = true;
    },
    del(id) {
      this.$confirm("你确定要删除该条信息吗？", "友情提示", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消操作",
        type: "warning"
      }).then(() => {
        // 确定删除调用接口
        delUserData({ id }).then(() => {
          this.$message.success("删除成功");
          this.search();
        });
      }).catch(()=>{

      });
    },
    setStatus(id) {
      setUserStatus({ id }).then(() => {
        this.$message.success("状态修改成功");
        this.search();
      });
    },
    edit(row){
      this.mode = "edit";
      // this.editData = row;
      this.$refs.addUserList.form = JSON.parse(JSON.stringify(row));
      this.$refs.addUserList.dialogVisible = true;
      console.log(row);
    }
  }
};
</script>

<style lang="less">
.userList {
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