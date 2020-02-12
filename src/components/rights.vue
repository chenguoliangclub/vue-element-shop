<template>
  <div>权限列表</div>
</template>

<script>
    export default {
      name: "rights.vue",
      data(){
          return {
            rightsList:[]
          }
      },
      methods:{
        //加载权限列表
        async loadRightsList() {
           const result = await this.$http.get('https://www.liulongbin.top:8888/api/private/v1/rights/list')
        }
      },
      created() {
        this.loadRightsList();
      }
    }
</script>

<style scoped>

</style>
