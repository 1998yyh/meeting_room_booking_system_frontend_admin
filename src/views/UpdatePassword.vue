<template>
  <div class="update-password-contianer">
    <el-form ref="formRef" :model="form" label-width="auto">
      <el-form-item required label="用户名">
        <el-input type="text" v-model="form.username" />
      </el-form-item>

      <el-form-item required label="邮箱">
        <el-input type="text" v-model="form.email" />
      </el-form-item>
      <el-form-item required label="验证码">
        <el-row w-full justify-between>
          <el-col :span="14">
            <el-input type="text" v-model="form.captcha" />
          </el-col>
          <el-col :span="8" :offset="2">
            <el-button type="primary" @click="sendEmail">发送验证码</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item required label="密码">
        <el-input show-password type="password" v-model="form.password" />
      </el-form-item>
      <el-form-item required label="确认密码">
        <el-input  show-password type="password" v-model="form.confirmPassword" />
      </el-form-item>
    </el-form>


    <div class="login-area" flex-center>
      <el-button w-lg type="primary" @click="submit">修改密码</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage,FormInstance } from 'element-plus';
import { sendUpdateCaptcha,updatePassword } from '../api/login'
import { useUserInfo } from '../hooks/useUserInfo';

interface updatePasswordDto {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  captcha: string;
}

const { getInfo, userInfo } = useUserInfo()


const form = reactive<updatePasswordDto>({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  captcha: ''
})

onMounted(async ()=>{

  await getInfo()
  Object.assign(form,{
    username:userInfo.value.username,
    email:userInfo.value.email
  })

  console.log(form);
})




const formRef = ref<FormInstance>()

const router = useRouter();

const submit = async () => {
  if(form.password !== form.confirmPassword){
    return ElMessage.error('两次密码不一致')
  }

  const res = await updatePassword(form)

  if ([200, 201].includes(res.code)) {
    ElMessage.success('修改成功')
    router.replace('/login')
  } else {
    ElMessage.error(res.message)
  }
}

const sendEmail = async () => {
  const res = await sendUpdateCaptcha(form.email)

  if ([200, 201].includes(res.code)) {
    ElMessage.success('发送成功')
  } else {
    ElMessage.error(res.message )
  }
}

</script>

<style lang="scss">
.update-password-contianer {
  margin: 50px auto;
  width: 400px;
}
</style>