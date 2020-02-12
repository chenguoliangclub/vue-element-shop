<template>
  <div>
    <!--   导航条  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片  -->
    <el-card class="box-card">
      <!-- 搜索框  -->
      <el-row>
        <el-col :span="15">
          <el-input placeholder="请输入内容"  class="input-with-select" >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="9">
          <el-button type="primary" @click="addUserDialog = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格  -->
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="username"
          label="用户名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="属性"
          width="180">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="email"
          label="电子邮箱">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="editUser(scope.row)" icon="el-icon-edit"></el-button>
            <el-button type="primary" @click="log(scope.row.id)" icon="el-icon-delete"></el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="toolTipEnterable">
              <el-button type="primary" @click="addRole(scope.row)" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码  -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParam.pagenum"
        :page-sizes="[1, 2, 10, 20]"
        :page-size="queryParam.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialog"
      width="30%"
      @close="resetForm">
      <el-form ref="addForm" :model="addForm" :rules="addFormRules"  label-width="80px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editUserDialog"
      width="30%">
      <el-form ref="editForm" :model="editForm" :rules="addFormRules"  label-width="80px" >
        <el-form-item label="用户名" >
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配用户角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="addRoleDialog"
      width="40%">
      <div>
        <p>当前用户名称:{{userInfo.username}}</p>
        <p>当前用户角色:{{userInfo.role_name}}</p>
        <p>分配新权限:
          <el-select v-model="selectedValue" placeholder="请选择">
            <el-option
              v-for="role in rolesList"
              :key="role.id"
              :label="role.roleName"
              :value="role.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitAddRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
      name: "UserList",
      data() {
        var checkPhone = (rule, value, callback) => {
          var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
          if (reg.test(value)) {
            return callback()
          }
          callback(new Error("手机号不符合规则！"))
        }
        return {
          queryParam: {
            pagenum: 1,
            pagesize: 2,
            query: null
          },
          total: 0,
          addUserDialog: false,
          editUserDialog: false,
          addRoleDialog: false,
          tableData: [],
          addForm: {
            username: null,
            password: null,
            phone: null
          },
          editForm: {
            id: null,
            username: null,
            password: null,
            phone: null
          },
          //记录当前分配权限的用户信息
          userInfo:{},
          addFormRules: {
            username: [
              {required: true, message: '用户名不能为空', trigger: 'blur'},
              {min: 3, max: 8, message: '用户名需要3到8个字符', trigger: 'blur'}
            ],
            password: [
              {required: true, message: '密码不能为空', trigger: 'blur'},
              {min: 5, max: 15, message: '密码需要5到15个字符', trigger: 'blur'}
            ],
            phone: [
              {required: true, message: '密码不能为空', trigger: 'blur'},
              {validator: checkPhone, trigger: 'blur'}
            ]
          },
          toolTipEnterable: false,
          rolesList: [],
          //select选择器当前选中项的值
          selectedValue: ''
        };
      },
      methods:{
        handleSizeChange(size){
          console.log(size);
          this.queryParam.pagesize = size;
          this.loadUserList();
        },
        handleCurrentChange(Current){
          console.log(Current);
          this.queryParam.pagenum = Current;
          this.loadUserList();
        },
        async loadUserList() {
          const {data: result} = await this.$http.get("https://www.liulongbin.top:8888/api/private/v1/users",{params:this.queryParam});
          if (result.meta.status == '200'){
            this.total = result.data.total;
            this.tableData = result.data.users;
          }else{
           this.$message.error("获取用户列表失败")
          }
          console.log(result)
        },
        log(id){
          console.log(id);
        },
        resetForm(){
          this.$refs.addForm.resetFields();
        },
        submitForm(formName){
          this.$refs[formName].validate(valid =>{
            console.log(valid);
          })
        },
        editUser(user){
          console.log(user);
          this.editForm = user
          this.editUserDialog = true
        },
        addRole(user){
          this.userInfo = user
          this.addRoleDialog = true
        },
        async loadRolesList() {
          const {data:result} = await this.$http.get('https://www.liulongbin.top:8888/api/private/v1/roles')
          if (result.meta.status == 200){
            this.rolesList = result.data;
            console.log(this.rolesList);
          }
        },
        async submitAddRole() {
          if (!this.selectedValue)
            return this.$message.error("请选择新角色")
          const {data: result} = await this.$http.put('https://www.liulongbin.top:8888/api/private/v1/users/'+ this.userInfo.id + '/role',
            {rid:this.selectedValue})
          if (result.meta.status == 200){
            this.$message.success("添加新角色成功")
          }else {
            this.$message.error("添加新角色失败")
          }
          this.loadUserList()
          this.addRoleDialog = false
        }
      },
      created() {
        this.loadUserList()
        this.loadRolesList()
      }
    }
</script>

<style scoped>
  .el-card{
    margin-top: 10px;
  }
  .el-table{
    margin-top: 10px;
  }
  .el-pagination{
    margin-top: 10px;
  }
</style>
