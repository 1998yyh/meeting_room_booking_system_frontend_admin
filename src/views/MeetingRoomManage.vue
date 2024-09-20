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
          <el-button type="primary" @click="getUserList">搜索会议室</el-button>
          <el-button type="primary" @click="getUserList">添加会议室</el-button>
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

        <el-table-column align="center" label="操作">
          <template #default="scope">
            <el-button @click="delRoom($event, scope.row.id)" text type="primary">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="paginationData.pageNo" v-model:page-size="paginationData.pageSize"
        :page-sizes="[5, 10, 20, 50]" layout="sizes, prev, pager, next" :total="paginationData.totalCount"
        @size-change="getUserList" @current-change="getUserList" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { deleteRoom, userSearch } from '../api/room'
import { ElMessage } from 'element-plus';

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


onMounted(() => {
  getUserList();
})

const getUserList = async () => {

  const res = await userSearch(
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

  const res = await deleteRoom(id)
  

  getUserList();

}


</script>

<style lang="scss"></style>