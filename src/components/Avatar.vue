<template>
  <div class="avatar" @click="handleClick">
    <div class="pic" v-if="userInfo.headPic">
      <img :src="userInfo.headPic" alt="">
    </div>

    <div class="no-pic" v-else>
      <el-icon>
        <User />
      </el-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserInfo } from '../hooks/useUserInfo'

defineOptions({
  name: "Avatar"
})

const { userInfo } = useUserInfo();

const router = useRouter();


const handleClick = () => {
  router.push('/user/info_modify')
}


</script>

<style lang="scss" scoped>
.pic {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  
  
  img{
    width: 100%;
    height: 100%;
  }
}
</style>
