<template>
  <div class="list-container">
    <div class="search-wrap">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">

        <el-form-item label="会议室名称">
          <el-input v-model="formInline.name" placeholder="请输入" clearable />
        </el-form-item>

        <el-form-item label="容纳人数">
          <el-input v-model="formInline.capacity" placeholder="请输入" clearable />
        </el-form-item>

        <el-form-item label="设备">
          <el-input v-model="formInline.equipment" placeholder="请输入" clearable />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getRoomList">搜索会议室</el-button>
          <el-button type="primary" @click="handleAddRoomClick">添加会议室</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="list-wrap">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column align="center" prop="name" label="会议室名称" />
        <el-table-column align="center" prop="capacity" label="容纳人数"></el-table-column>
        <el-table-column align="center" prop="location" label="地点" />
        <el-table-column align="center" prop="equipment" label="设备" />
        <el-table-column align="center" prop="description" label="描述" />
        <el-table-column align="center" prop="createTime" label="创建时间" />
        <el-table-column align="center" prop="updateTime" label="更新时间" />
        <el-table-column align="center" label="预定状态">
          <template #default="scope">
            {{ scope.row.isBooked ? '已预定' : '可预定' }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="200px">
          <template #default="scope">
            <span class="control-text" @click="updateRoom($event, scope.row.id)">更新</span>
            <span class="control-text" ml-4 @click="delRoom($event, scope.row.id)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="paginationData.pageNo" v-model:page-size="paginationData.pageSize"
        :page-sizes="[5, 10, 20, 50]" layout="sizes, prev, pager, next" :total="paginationData.totalCount"
        @size-change="getRoomList" @current-change="getRoomList" />
    </div>

    <create-room-modal ref="createRoomModalRef" @update="handleUpdateRoomEvent"
      @submit="handleAddRoomEvent"></create-room-modal>
  </div>
</template>

<script lang="ts" setup>
import { reactive, useTemplateRef } from 'vue'
import CreateRoomModal from '../components/CreateRoomModal.vue';
import { deleteRoom, roomSearch, createRoom, getRoom, renewalRoom, type CreateMeetingRoom } from '../api/room'
import { ElMessage, ElMessageBox } from 'element-plus';

interface SearchMeetingRoom {
  name?: string;
  capacity?: number;
  equipment?: string;
}

interface MeetingRoomSearchResult {
  id: number,
  name: string;
  capacity: number;
  location: string;
  equipment: string;
  description: string;
  isBooked: boolean;
  createTime: Date;
  updateTime: Date;
}


const formInline = reactive<SearchMeetingRoom>({
  name: '',
  capacity: undefined,
  equipment: '',
})

const paginationData = reactive({
  pageNo: 1,
  pageSize: 5,
  totalCount: 5,
})

const tableData = ref<MeetingRoomSearchResult[]>([])

const createRoomModalRef = useTemplateRef('createRoomModalRef')


onMounted(() => {
  getRoomList();
})

const getRoomList = async () => {
  const res = await roomSearch(
    paginationData.pageNo,
    paginationData.pageSize,
    formInline.name,
    formInline.capacity,
    formInline.equipment
  )

  if (res.code === 200) {
    tableData.value = res.data.meetingRooms
    paginationData.totalCount = res.data.totalCount
  } else {
    ElMessage.error(res.message)
  }
}


const delRoom = async (_: any, id: number) => {
  ElMessageBox.confirm(
    '确定要删除吗？',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    await deleteRoom(id)
    paginationData.pageNo = 1;
    getRoomList();
  })
}


const updateRoom = async (_: any, id: number) => {
  const { code, data, message } = await getRoom(id)

  if ([200, 201].includes(code)) {
    const { id } = data;
    createRoomModalRef.value!.updateRoom(id, data as CreateMeetingRoom)
  } else {
    ElMessage.error(message)
  }
}




const handleAddRoomClick = async () => {
  createRoomModalRef.value!.createRoom();
}


const handleAddRoomEvent = async (data: CreateMeetingRoom) => {
  const { code, message } = await createRoom(data)
  if (code === 200 || code === 201) {
    paginationData.pageNo = 1;
    getRoomList();
    createRoomModalRef.value!.closeModal();
    ElMessage.success('创建成功')
  } else {
    ElMessage.error(message)
  }
}

const handleUpdateRoomEvent = async (id: number, data: CreateMeetingRoom) => {
  const { code, message } = await renewalRoom({
    id,
    ...data
  })
  if (code === 200 || code === 201) {
    paginationData.pageNo = 1;
    getRoomList();
    createRoomModalRef.value!.closeModal();
    ElMessage.success('更新成功')
  } else {
    ElMessage.error(message)
  }
}


</script>

<style lang="scss">
.control-text {
  color: #409eff;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    color: #0976e4;
  }
}
</style>