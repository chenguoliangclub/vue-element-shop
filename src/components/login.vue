<template>
  <div id="login-body">
    <div id="login-container">
      <div id="login-image">
        <img src="../assets/logo.png" />
      </div>
      <div id="login-form">
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item prop="username">
            <el-input prefix-icon="el-icon-user" v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input prefix-icon="el-icon-s-goods" v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item class="form-btn">
            <el-button type="primary" @click="submitForm('form')">登录</el-button>
            <el-button type="info" @click="resetForm('form')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "login",
        data(){
          return{
            form:{
              username: 'admin',
              password: '123456'
            },
            rules: {
              username: [
                {required: true, message: '请输入用户名', trigger: 'blur'},
                {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
              ],
              password: [
                {required: true, message: '请输入密码', trigger: 'blur'},
                {min: 5, max: 8, message: '长度在 5 到 8 个字符', trigger: 'blur'}
              ]
            }
          }
        },
      methods:{
          submitForm(formName){
            this.$refs[formName].validate(async (validate)=> {
              if (validate) {
         //       const {data: result} = await this.$http.get("../static/loginRes.json", this.form);
                const {data: result} = await this.$http.post("https://www.liulongbin.top:8888/api/private/v1/login", this.form);
                console.log(result);
                if (result.meta.status == 200){
                  window.sessionStorage.setItem("token", result.data.token);
                  this.$message.success("登录成功");
                  this.$router.push({path: "/Home"})
                }else{
                  this.$message.error("登录错误，" + result.meta.msg);
                }
              } else {
                this.$message.error("输入信息有误");
              }
            })
          },
        resetForm(formName){
          this.$refs[formName].resetFields();
        }
      }
    }
</script>

<style lang="less" scoped>
  #login-body{
    height: 100%;
    background-color: #2b4b6b;
  }
  #login-container{
    color: red;
    background-color: white;
    width: 35%;
    height: 50%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
  #login-image{
    position: absolute;
    width: 30%;
    left: 50%;
    transform: translate(-50%,-50px);
    border: white 1px solid;
    border-radius: 50%;
    padding: 10px;
    background-color: white;
    box-shadow: 0 0 10px #eeeeee;

    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #eeeeee;
    }
  }
  #login-form{
    position: absolute;
    bottom: 10px;
    width: 100%;
    padding: 10px 20px;
    box-sizing: border-box;
    .form-btn{
      display: flex;
      justify-content: flex-end;
    }
  }

</style>
