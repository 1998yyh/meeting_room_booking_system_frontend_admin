<template>
  <el-dialog v-model="dialogVisiable" @open="handleOpenEvent">
    <template #header>
      {{ isEdit ? '更新会议室' : '创建会议室' }}
    </template>
    <template #default>
      <el-form :model="form" label-width="auto">
        <el-form-item required label="会议室名">
          <el-input type="text" v-model="form.name" />
        </el-form-item>
        <el-form-item required label="容纳人数">
          <el-input type='number' v-model="form.capacity" />
        </el-form-item>
        <el-form-item required label="位置">
          <el-input type="text" v-model="form.location" />
        </el-form-item>
        <el-form-item required label="设备">
          <el-input type="text" v-model="form.equipment" />
        </el-form-item>
        <el-form-item required label="描述">
          <el-input type="text" v-model="form.description" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
      <el-button @click="dialogVisiable = false">取消</el-button>
    </template>
  </el-dialog>


</template>

<script lang="ts" setup>
import { ElButton, ElDialog } from 'element-plus';

defineOptions({
  name: "CreateRoomModal"
})


const isEdit = ref(false);
const updateId = ref<number>(0)
const dialogVisiable = ref(false)


export interface CreateMeetingRoom {
  name: string;
  capacity: number;
  location: string;
  equipment: string;
  description: string;
}


const emit = defineEmits<{
  submit: [data: CreateMeetingRoom],
  update: [id: number, data: CreateMeetingRoom]
}>()


const form = reactive<Partial<CreateMeetingRoom>>({
  name: '',
  capacity: 0,
  location: '',
  equipment: '',
  description: '',
})



const handleSubmit = () => {
  const result = form as CreateMeetingRoom;
  if (isEdit.value) {
    emit('update', updateId.value, result)
  } else {
    emit('submit', result)
  }
}


// 清空数据
const handleOpenEvent = () => {

}


const createRoom = () => {
  dialogVisiable.value = true;
  isEdit.value = false;
  handleOpenEvent();
}

const updateRoom = (id: number, data: CreateMeetingRoom) => {
  isEdit.value = true;
  dialogVisiable.value = true;
  updateId.value = id;
  Object.assign(form,data)
  // form.value = data;

}


const closeModal = () => {
  dialogVisiable.value = false;
}


defineExpose({
  createRoom,
  updateRoom,
  closeModal
})


</script>

<style lang="scss" scoped></style>
