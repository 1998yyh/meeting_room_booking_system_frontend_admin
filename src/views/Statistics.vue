<template>
  <div class="list-container">
    <div class="search-wrap">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="formInline.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="formInline.nickName" placeholder="请输入昵称" clearable />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formInline.email" placeholder="请输入邮箱" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUserList">搜索用户</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="list-wrap">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="username" label="用户名" width="180" />
        <el-table-column prop="headPic" label="头像">
          <template #default="scope">
            <el-image style="width: 100px; height: 100px" :src="scope.row.headPic" fit="fill" />
          </template>
        </el-table-column>
        <el-table-column prop="nickName" label="昵称" width="180" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="createTime" label="注册时间" />
        <el-table-column prop="isFrozen" label="状态">
          <template #default="{ row }">
            <el-text>{{ row.isFrozen ? '已冻结' : '已激活' }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="freezeUser($event, scope.row.id)" text type="primary">冻结</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-model:current-page="paginationData.pageNo" v-model:page-size="paginationData.pageSize" :page-sizes="[5, 10, 20, 50]" layout="sizes, prev, pager, next" :total="paginationData.totalCount" @size-change="getUserList" @current-change="getUserList" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { freeze, userSearch } from '../api/list'
import { ElMessage } from 'element-plus';
import { type UserSearchResult } from '../type'

interface SearchUser {
  username: string;
  nickName: string;
  email: string;
}

const formInline = reactive<SearchUser>({
  username: '',
  nickName: '',
  email: '',
})

const paginationData = reactive({
  pageNo: 1,
  pageSize: 5,
  totalCount:5,
})

const tableData = ref<UserSearchResult[]>([])


onMounted(() => {
  getUserList();
})

const getUserList = async () => {
  const { data } = await userSearch(
    paginationData.pageNo,
    paginationData.pageSize,
    formInline.username,
    formInline.nickName,
    formInline.email
  )


  paginationData.totalCount = data.totalCount
  tableData.value = data.users
}

const freezeUser = async (_: any, id: number) => {
  const { code, message } = await freeze(id)
  if (code === 200) {
    ElMessage.success('冻结成功')
  } else {
    ElMessage.warning(message)
  }

  getUserList();
}

</script>

<style lang="scss"></style>