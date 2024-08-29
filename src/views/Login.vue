<template>
  <div class="login-contianer">
    <div text-center mb20 text-30 font-600>标题</div>
    <el-form :model="form" label-width="auto">
      <el-form-item required label="用户名">
        <el-input type="text" v-model="form.name" />
      </el-form-item>
      <el-form-item required label="密码">
        <el-input show-password type="password" v-model="form.password" />
      </el-form-item>
    </el-form>


    <div class="opreate-area" flex justify-between m-15>
      <el-link type="primary" @click="router.push('/register')">创建账户</el-link>
      <el-link type="primary" @click="router.push('/updatePassword')">忘记密码</el-link>
    </div>

    <div class="login-area" flex-center>
      <el-button w-lg type="primary" @click="submit">登录</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { login } from '../api/login'

const router = useRouter();

const form = reactive({
  name: '',
  password: ''
})


const submit = async () => {
  const { code, data, message } = await login(form.name, form.password)
  if ([200, 201].includes(code)) {
    ElMessage.success('登录成功')
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    localStorage.setItem('user_info', JSON.stringify(data.userInfo));
    router.replace('/')
  } else {
    ElMessage.error(message)
  }
}

</script>

<style lang="scss">
.login-contianer {
  margin: 200px auto;
  width: 400px;
}
</style>