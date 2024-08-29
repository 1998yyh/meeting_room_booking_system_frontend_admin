import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Index',
      component: () => import('../views/Index.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },

    {
      path: '/errorPage',
      name: 'errorPage',
      component: () => import('../views/ErrorPage.vue')
    },
    {
      path: '/UserManage',
      name: 'UserManage',
      component: () => import('../views/UserManage.vue')
    },
    { path: '/:catchAll(.*)', redirect: '/errorPage' }
  ]
})

export default router
