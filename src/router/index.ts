import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      name:'home',
      component:()=> import('../views/Index.vue'),
      children:[
        {
          path:'',
          component:()=>import('../views/aaa.vue')
        },
        {
          path:'bbb',
          component:()=>import('../views/bbb.vue')
        },
        {
          path:"updateInfo",
          component:()=>import('../views/UpdateInfo.vue')
        }
      ]
    },

    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/errorPage',
      name: 'errorPage',
      component: () => import('../views/ErrorPage.vue')
    },
    {
      path: '/updatePassword',
      name: 'updatePassword',
      component: () => import('../views/UpdatePassword.vue')
    },
    { path: "/:catchAll(.*)", redirect: '/errorPage' },
  ]
})

export default router
