<template>
  <div class="main">
    <div class="header" flex-center justify-between>
      <div class="title">会议室预定系统</div>
      <Avatar></Avatar>
    </div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import Avatar from '../components/avatar.vue'
import { useUserInfo } from '../hooks/useUserInfo'


const {
  getInfo
} = useUserInfo();


onMounted(async () => {
   getInfo();
})

</script>

<style lang="scss">
.main {
  margin: 0;
  padding: 0;
  min-height: 100vh;

  .header {
    padding: 20px;
    border-bottom: 1px solid;
  }
}
</style>