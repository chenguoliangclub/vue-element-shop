<template>
  <el-container class="el-container">
    <el-header class="el-header">
        <div class="head-image">
          <img src="../assets/logo.jpg" width="80px" height="70px" />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="collapse?'64px':'200px'">
        <div class="collapse" @click="handleCollapse">III</div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#2b4b6b"
          text-color="#fff"
          active-text-color="#ffd04b"
          :router="true"
          :unique-opened="true"
          :collapse="collapse"
          :collapse-transition="false">
          <!--  一级菜单   -->
          <el-submenu :index="item.id" v-for="item in navMenuData" :key="item.id">
            <template slot="title">
              <i :class="item.icon"></i>
              <span v-text="item.menuName"></span>
            </template>
            <!--  二级菜单  -->
            <el-menu-item :index="submenu.path" v-for="submenu in item.children" :key="submenu.id">
              <template slot="title">
                <i :class="submenu.icon"></i>
                <span v-text="submenu.menuName"></span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
    export default {
      name: "Home",
      data(){
        return {
          navMenuData:[],
          collapse: false
        }
      },
      methods:{
        async loadNavMenuData() {
          const {data:result} = await this.$http.get("../static/getMenuData.json");
          this.navMenuData = result;
          console.log(result);
        },
        handleCollapse(){
          this.collapse = !this.collapse;
        }
      },
      created() {
        this.loadNavMenuData();
      }
    }
</script>

<style lang="less" scoped>
  .el-container{
    height: 100%;
    .el-aside{
      background-color: #2b4b6b;
      .el-menu{
        border-right: 0px;
      }
      .collapse{
        font-size: 16px;
        color: white;
        line-height: 25px;
        letter-spacing: 1px;
        cursor: pointer;
      }
    }
  }
.el-header{
  background-color: #2b4b6b;
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  .head-image{
    display: flex;
    align-items: center;
    color: white;
    font-size: 16px;
  }
}
</style>
