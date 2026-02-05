<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">操作日志</h1>
      <p class="page-description">系统操作记录和审计日志</p>
    </div>

    <el-card>
      <div class="table-toolbar">
        <div class="table-search">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索操作内容"
            style="width: 300px"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select v-model="searchForm.action_type" placeholder="操作类型" style="width: 120px" clearable>
            <el-option label="全部" value="" />
            <el-option label="创建" value="create" />
            <el-option label="编辑" value="update" />
            <el-option label="删除" value="delete" />
            <el-option label="审核" value="review" />
          </el-select>
          <el-select v-model="searchForm.target_type" placeholder="操作对象" style="width: 120px" clearable>
            <el-option label="全部" value="" />
            <el-option label="音乐" value="song" />
            <el-option label="用户" value="user" />
            <el-option label="评论" value="comment" />
          </el-select>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </div>
      </div>

      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="created_at" label="操作时间" width="180" sortable>
          <template #default="{ row }">
            {{ formatDateTime(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column prop="admin_name" label="操作者" width="120" />
        <el-table-column prop="action_type" label="操作类型" width="100">
          <template #default="{ row }">
            <el-tag>{{ row.action_type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="target_type" label="操作对象" width="100">
          <template #default="{ row }">
            <el-tag type="info">{{ row.target_type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="action_content" label="操作内容" min-width="200" />
        <el-table-column prop="ip_address" label="IP地址" width="120" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getLogList } from '@/api/log'
import { formatDateTime } from '@/utils/format'
import { PAGINATION } from '@/utils/constants'

const loading = ref(false)
const tableData = ref([])

const searchForm = reactive({
  keyword: '',
  action_type: '',
  target_type: ''
})

const pagination = reactive({
  page: PAGINATION.PAGE,
  pageSize: PAGINATION.PAGE_SIZE,
  total: 0
})

const loadData = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      page_size: pagination.pageSize,
      keyword: searchForm.keyword || undefined,
      action_type: searchForm.action_type || undefined,
      target_type: searchForm.target_type || undefined
    }
    const res = await getLogList(params)
    if (res.code === 0 && res.data) {
      tableData.value = res.data.list || []
      pagination.total = res.data.total || 0
    }
  } catch (error) {
    // 处理错误
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadData()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.action_type = ''
  searchForm.target_type = ''
  handleSearch()
}

const handleView = (row) => {
  // TODO: 查看日志详情
}

const handleSizeChange = () => {
  loadData()
}

const handlePageChange = () => {
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.pagination-container {
  margin-top: $spacing-lg;
  display: flex;
  justify-content: flex-end;
}
</style>

