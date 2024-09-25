<template>
  <div class="list-container">
    <div class="search-wrap">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="formInline.username" placeholder="请输入用户名" clearable />
        </el-form-item>

        <el-form-item label="会议室名称">
          <el-input v-model="formInline.meetingRoomName" placeholder="请输入会议室名称" clearable />
        </el-form-item>

        <el-form-item label="会议室地址">
          <el-input v-model="formInline.meetingRoomPosition" placeholder="请输入会议室地址" clearable />
        </el-form-item>
        
        <el-form-item label="起始时间">
          <el-date-picker
            v-model="formInline.rangeStartTime"
            type="datetime"
            placeholder="请选择起始时间"
            format="YYYY/MM/DD HH:mm:ss"
            value-format="x"
          />
        </el-form-item>

        <el-form-item label="结束时间">
          <el-date-picker
            v-model="formInline.rangeEndTime"
            type="datetime"
            placeholder="请选择结束时间"
            format="YYYY/MM/DD HH:mm:ss"
            value-format="x"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getBookingList">搜索用户</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="list-wrap">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="roomName" label="会议室名称" />
        <el-table-column prop="roomLocation" label="会议室位置" />
        <el-table-column prop="user" label="预定人" />
        <el-table-column prop="startTime" label="开始时间"></el-table-column>

        <el-table-column prop="endTime" label="结束时间"></el-table-column>
        <el-table-column prop="status" label="审批状态" />
        <el-table-column prop="createTime" label="预定时间" />
        <el-table-column prop="note" label="备注" />
        <el-table-column fixed="right" prop="email" label="操作">
          <template #default="scope">
            <span class="control-text" @click="apply($event, scope.row.id)">通过</span>
            <span class="control-text" ml-4 @click="reject($event, scope.row.id)">驳回</span>
            <span class="control-text" ml-4 @click="unbind($event, scope.row.id)">解除</span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-model:current-page="paginationData.pageNo" v-model:page-size="paginationData.pageSize"
        :page-sizes="[5, 10, 20, 50]" layout="sizes, prev, pager, next" :total="paginationData.totalCount"
        @size-change="getBookingList" @current-change="getBookingList" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { bookingSearch, applyBooking, rejectBooking, unbindBooking } from '../api/booking'
import { ElMessage, TableColumnCtx } from 'element-plus';
import { type BookingSearchResult } from '../type'
import dayjs from "dayjs";

interface SearchBooking {
  username: string;
  meetingRoomName: string;
  meetingRoomPosition: string;
  rangeStartTime: number;
  rangeEndTime: number;
}

const formInline = reactive<Partial<SearchBooking>>({
  username: undefined,
  meetingRoomName: undefined,
  meetingRoomPosition: undefined,
  rangeStartTime: undefined,
  rangeEndTime: undefined,
})

const paginationData = reactive({
  pageNo: 1,
  pageSize: 5,
  totalCount: 5,
})

const tableData = ref<BookingSearchResult[]>([])

const getBookingList = async () => {
  const { data } = await bookingSearch(
    paginationData.pageNo,
    paginationData.pageSize,
    formInline.username,
    formInline.meetingRoomName,
    formInline.meetingRoomPosition,
    formInline.rangeStartTime,
    formInline.rangeEndTime,
  )

  paginationData.totalCount = data.totalCount
  tableData.value = data.bookings.map((item: any) => ({
    roomName: item.room.name,
    roomLocation: item.room.location,
    user: item.user.username,
    startTime: dayjs(new Date(item.startTime)).format('YYYY-MM-DD HH:mm:ss'),
    endTime: dayjs(new Date(item.endTime)).format('YYYY-MM-DD HH:mm:ss'),
    status: item.status,
    createTime: dayjs(new Date(item.createTime)).format('YYYY-MM-DD HH:mm:ss'),
    note: item.note,
    description: item.description,
    id: item.id,
  }))
}

const apply = async (_: any, id: number) => {
  const { code, message } = await applyBooking(id);
  if ([200, 201].includes(code)) {
    ElMessage.success('审批通过成功')
    getBookingList();
  } else {
    ElMessage.error(message)
  }
}

const reject = async (_: any, id: number) => {
  const { code, message } = await rejectBooking(id);
  if ([200, 201].includes(code)) {
    ElMessage.success('审批拒绝成功')
    getBookingList();
  } else {
    ElMessage.error(message)
  }
}

const unbind = async (_: any, id: number) => {
  const { code, message } = await unbindBooking(id);
  if ([200, 201].includes(code)) {
    ElMessage.success('解除绑定成功')
    getBookingList();
  } else {
    ElMessage.error(message)
  }
}

onMounted(async () => {
  getBookingList();
})


</script>

<style lang="scss"></style>