<template>
  <div class="update-info-contianer">
    <el-form :model="form" label-width="auto">
      <el-form-item required label="头像">
        <el-upload class="avatar-uploader" :limit="1" :show-file-list="true" :with-credentials="true"
          :before-upload="handleBeforeUpload" :http-request="handleImageSubmit">
          <img v-if="form.headPic" :src="form.headPic" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item required label="昵称">
        <el-input type="text" v-model="form.nickName" />
      </el-form-item>

      <el-form-item required label="邮箱">
        <el-input disabled type="text" v-model="form.email" />
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
    </el-form>

    <div class="login-area" flex-center>
      <el-button w-lg type="primary" @click="submit">修改密码</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { updateUserInfoCaptcha, updateInfo, uploadFile } from '../api/login'
import { useUserInfo } from '../hooks/useUserInfo'
import type { UploadProps, UploadRawFile } from 'element-plus'


defineOptions({
  name: 'updateInfo'
})

const router = useRouter();

const { getInfo, userInfo } = useUserInfo()

const form = reactive({
  headPic: userInfo.value.headPic,
  nickName: userInfo.value.nickName,
  email: userInfo.value.email,
  captcha: ''
})

const file = ref<UploadRawFile>()

const handleBeforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  file.value = rawFile;
}

const handleImageSubmit = async () => {
  const res = await uploadFile(file.value)
  form.headPic = 'http://localhost:3000/' + res.data
}






const submit = async () => {
  await updateInfo(form)
  await getInfo();
  ElMessage.success('修改成功')
  router.replace('/')


}

const sendEmail = async () => {
  await updateUserInfoCaptcha()
  ElMessage.success('发送成功')
}

</script>

<style lang="scss">
.update-info-contianer {
  margin: 50px auto;
  width: 400px;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>



<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
