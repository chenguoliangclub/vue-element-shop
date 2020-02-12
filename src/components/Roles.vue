<template>
  <div>
    <!--   导航条  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片  -->
    <el-card class="Top10">
      <div class="float_left"><el-button type="primary">添加角色</el-button></div>
      <el-table :data="rolesList" border class="Top10">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1,i) in scope.row.children" :key="item1.id" :class="['bdBottom',i==0?'bdTop':'','yCenter']">
              <el-col :span="8" >
                <el-tag closable @close="handleTagClose(scope.row.id,item1.id,[scope.$index,i])">
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="16">
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2==0?'':'bdTop']">
                  <el-col :span="6">
                    <el-tag closable type="success" @close="handleTagClose(scope.row.id,item2.id,[scope.$index,i,i2])">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable v-for="(item3,i3) in item2.children" :key="item3.id"
                     type="warning" @close="handleTagClose(scope.row.id,item3.id,[scope.$index,i,i2,i3])">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
            <el-button type="waring" icon="el-icon-setting" size="small"  @click="handleAddAuthDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--  分配权限弹出框  -->
    <el-dialog
      title="分配权限"
      :visible.sync="addAuthDialog"
      width="40%"
      @close="handleAddAuthDialogClose">
      <el-tree
        ref="tree"
        :data="authList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKey"
        :props="treeProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAddAuthDialogClose">取 消</el-button>
        <el-button type="primary" @click="submitAddAuth">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
      name: "Roles",
      data(){
        return {
          rolesList:[],
          addAuthDialog: false,
          authList:[],
          defKey:[],
          treeProps:{
            children:'children',
            label: 'authName'
          },
          //将要赋予权限的角色id
          roleId:null
        }
      },
      methods:{
        async loadRolesList() {
          const {data:result} = await this.$http.get('https://www.liulongbin.top:8888/api/private/v1/roles')
          if (result.meta.status == 200){
            this.rolesList = result.data;
            console.log(this.rolesList);
          }
        },
        //删除权限标签，index为具体权限索引值
        async handleTagClose(roleId, authId, index) {
          const result = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err)
          console.log(result)
          if (result == 'confirm'){
            console.log("roleId:" + roleId + ",authId:" + authId + ",index:" + index)
            switch (index.length) {
              case 2:
                //该角色的权限列表
                console.log(this.rolesList)
                const roleIndex = index[0]
                console.log(this.rolesList[roleIndex].children[index[1]])
                this.rolesList[roleIndex].children.splice(index[1],1)
                console.log(this.rolesList)
                break;
              case 3:
                break;
              case 4:
                break;
            }
          }
        },
        async loadAuthList() {
          const {data:result} = await this.$http.get('https://www.liulongbin.top:8888/api/private/v1/rights/tree')
          if (result.meta.status == '200'){
            return this.authList = result.data;
          }
          this.$message.error("获取权限列表失败")
        },
        //添加默认勾选项
        loadDefKey(node,arr){
          if (!node.children){
            arr.push(node.id)
          }else{
            node.children.forEach(item => {
              this.loadDefKey(item,arr)
            })
          }
        },
        //  打开添加角色权限对话框处理函数
        handleAddAuthDialog(node){
          this.roleId = node.id
          this.loadAuthList()
          this.loadDefKey(node,this.defKey)
          this.addAuthDialog = true
        },
        //  关闭添加角色权限对话框处理函数
        handleAddAuthDialogClose(){
          this.addAuthDialog = false
          this.defKey = []
        },
        async submitAddAuth() {
          const authList = [
            ...this.$refs.tree.getHalfCheckedKeys(),
            ...this.$refs.tree.getCheckedKeys()
          ]
          console.log(authList)
          const {data: res} = await this.$http.post("https://www.liulongbin.top:8888/api/private/v1/roles/" + this.roleId + "/rights",
            {rids: authList.join(",")})
          if (res.meta.status != '200')
            return this.$message.error('分配权限失败')
          this.$message.success('分配权限成功')
          this.loadRolesList()
          this.addAuthDialog = false
        }
      },
      created() {
        this.loadRolesList()
        this.loadAuthList()
      }
    }
</script>

<style lang="less" scoped>
.float_left{
  display: flex;
  justify-content: left;
}
.el-tag{
  margin: 10px;
}
.bdTop{
  border-top:1px solid #eeeeee;
}
.bdBottom{
  border-bottom:1px solid #eeeeee;
}
.yCenter{
  display: flex;
  align-items: center;
}
</style>
