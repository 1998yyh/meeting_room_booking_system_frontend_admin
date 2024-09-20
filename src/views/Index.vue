<template>
  <div class="page">
    <div class="header" flex-center justify-between>
      <div class="title">会议室预定系统</div>
      <Avatar></Avatar>
    </div>
    

    <div class="main">
      <el-menu class="menu" :router="true" :default-active="$route.path">
        <el-menu-item v-for="item in menuList" :key="item.key" :index="item.key">
          <span>{{ item.label }}</span>
        </el-menu-item>
      </el-menu>

      <div class="container">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Avatar from '../components/Avatar.vue'
import { useUserInfo } from '../hooks/useUserInfo'


const menuList = [
  {
    key: '/meeting_room_manage',
    label: "会议室管理",
  },
  {
    key: '/booking_manage',
    label: "预定管理"
  },
  {
    key: '/',
    label: "用户管理"
  },
  {
    key: '/statistics',
    label: "统计"
  },
  {
    key: '/user/info_modify',
    label: "信息修改"
  },
  {
    key: '/user/password_modify',
    label: "密码修改"
  }
];

const {
  getInfo
} = useUserInfo();


onMounted(async () => {
  getInfo();
})

</script>

<style lang="scss">
.page {
  margin: 0;
  padding: 0;
  min-height: 100vh;

  .header {
    padding: 20px;
    // border-bottom: 1px solid;
  }
}


.main {
  display: flex;
}

.menu {
  width: 180px;

}

.container {
  padding: 20px;
}
</style>