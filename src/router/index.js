import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '../components/login.vue'
import Home from '../components/Home.vue'
import UserList from '../components/UserList'
import Welcome from "../components/Welcome";
import Right from "../components/rights";
import Roles from "../components/Roles";

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      redirect: '/Welcome',
      children:[
        {path: '/Welcome',component: Welcome},
        {path: '/userlist',component: UserList},
        {path: '/right',component: Right},
        {path: '/roles',component: Roles}
      ]
    }
  ]
})
router.beforeEach((to, from, next)=>{
  if (to.path == '/login')
    next()
  const token = window.sessionStorage.getItem("token")
  if (token)
    next()
  else
    next('/login')
})
export default router
