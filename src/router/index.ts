import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Index',
      component: () => import('../views/Index.vue'),
      children:[
        {
          path:'',
          name:'list',
          component:()=> import('../views/List.vue')
        },
        {
          path:'user/info_modify',
          name:'infoModify',
          component:()=> import('../views/UpdateInfo.vue')
        },
        {
          path:'user/password_modify',
          name:'passwordModify',
          component:()=> import('../views/UpdatePassword.vue')
        },
        {
          path:'meeting_room_manage',
          name:'meetingRoomManage',
          component:()=> import('../views/MeetingRoomManage.vue')
        },
        {
          path:'booking_manage',
          name:'bookingManage',
          component:()=> import('../views/BookingManage.vue')
        },
        {
          path:'statistics',
          name:'statistics',
          component:()=> import('../views/Statistics.vue')
        }
      ]
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
