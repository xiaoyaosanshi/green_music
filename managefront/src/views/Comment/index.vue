<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">评论管理</h1>
      <p class="page-description">管理平台所有评论内容</p>
    </div>

    <el-card>
      <div class="table-toolbar">
        <div class="table-search">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索评论内容、歌曲名、用户名"
            style="width: 300px"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select v-model="searchForm.review_status" placeholder="审核状态" style="width: 120px" clearable>
            <el-option label="全部" value="" />
            <el-option label="正常" value="normal" />
            <el-option label="待审核" value="pending" />
            <el-option label="已删除" value="deleted" />
          </el-select>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </div>
      </div>

      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="song_title" label="歌曲名称" min-width="150" />
        <el-table-column prop="content" label="评论内容" min-width="200">
          <template #default="{ row }">
            {{ truncateText(row.content, 50) }}
          </template>
        </el-table-column>
        <el-table-column prop="username" label="评论者" width="120" />
        <el-table-column prop="like_count" label="点赞数" width="80" sortable />
        <el-table-column prop="reply_count" label="回复数" width="80" sortable />
        <el-table-column prop="review_status" label="审核状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="row.review_status === 'normal' ? 'success' : row.review_status === 'deleted' ? 'danger' : 'warning'"
            >
              {{ row.review_status === 'normal' ? '正常' : row.review_status === 'deleted' ? '已删除' : '待审核' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="发布时间" width="180" sortable>
          <template #default="{ row }">
            {{ formatDateTime(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
            <el-button
              v-if="row.review_status === 'pending'"
              link
              type="success"
              size="small"
              @click="handleReview(row)"
            >
              审核
            </el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getCommentList, reviewComment, deleteComment } from '@/api/comment'
import { formatDateTime, truncateText } from '@/utils/format'
import { PAGINATION } from '@/utils/constants'

const loading = ref(false)
const tableData = ref([])

const searchForm = reactive({
  keyword: '',
  review_status: ''
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
      review_status: searchForm.review_status || undefined
    }
    const res = await getCommentList(params)
    if (res.code === 0 && res.data) {
      tableData.value = res.data.list || []
      pagination.total = res.data.total || 0
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
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
  searchForm.review_status = ''
  handleSearch()
}

const handleView = (row) => {
  // TODO: 查看评论详情
  ElMessage.info('功能开发中')
}

const handleReview = async (row) => {
  try {
    await reviewComment(row.id, { status: 'normal' })
    ElMessage.success('审核通过')
    loadData()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这条评论吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteComment(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
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

