<template>
  <div class="register-contianer">
    <div text-center mb20 text-30 font-600>标题</div>
    <el-form ref="formRef" :model="form" label-width="auto">
      <el-form-item required label="用户名">
        <el-input type="text" v-model="form.username" />
      </el-form-item>
      <el-form-item required label="昵称">
        <el-input type="text" v-model="form.nickName" />
      </el-form-item>
      <el-form-item required label="密码">
        <el-input show-password type="password" v-model="form.password" />
      </el-form-item>
      <el-form-item required label="确认密码">
        <el-input  show-password type="password" v-model="form.confirmPassword" />
      </el-form-item>
      <el-form-item required label="邮箱">
        <el-input type="text" v-model="form.email" />
      </el-form-item>
      <el-form-item required label="验证码">
        <el-row>
          <el-col :span="16">
            <el-input type="text" v-model="form.captcha" />
          </el-col>
          <el-col :span="6" :offset="2">
            <el-button type="primary" @click="sendEmail">发送验证码</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>


    <div class="opreate-area" flex justify-end m-5>
      <el-link type="primary" @click="router.replace('/login')">已有账户？去登录</el-link>
    </div>

    <div class="login-area" flex-center>
      <el-button w-lg type="primary" @click="submit">注册</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage,FormInstance } from 'element-plus';
import { sendRegisterCaptcha,register } from '../api/login'

interface RegisterUser {
  username: string;
  nickName: string;
  password: string;
  confirmPassword: string;
  email: string;
  captcha: string;
}


const form = reactive<RegisterUser>({
  username: '',
  nickName: '',
  password: '',
  confirmPassword: '',
  email: '',
  captcha: ''
})

const formRef = ref<FormInstance>()

const router = useRouter();

const submit = async () => {
  if(form.password !== form.confirmPassword){
    return ElMessage.error('两次密码不一致')
  }

  const res = await  register(form)

  if ([200, 201].includes(res.code)) {
    ElMessage.success('注册成功')
    router.replace('/login')
  } else {
    ElMessage.error(res.message)
  }
}

const sendEmail = async () => {
  const res = await sendRegisterCaptcha(form.email)

  if ([200, 201].includes(res.code)) {
    ElMessage.success('发送成功')
  } else {
    ElMessage.error(res.message )
  }
}

</script>

<style lang="scss">
.register-contianer {
  margin: 50px auto;
  width: 400px;
}
</style>