<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">歌词管理</h1>
      <p class="page-description">管理平台所有歌词内容</p>
    </div>

    <el-card>
      <div class="table-toolbar">
        <div class="table-search">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索歌曲名"
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
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
          <el-select v-model="searchForm.type" placeholder="歌词类型" style="width: 120px" clearable>
            <el-option label="全部" value="" />
            <el-option label="官方" value="official" />
            <el-option label="用户上传" value="user_upload" />
          </el-select>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </div>
        <div>
          <el-button type="primary" :icon="Plus" @click="handleCreate">上传官方歌词</el-button>
        </div>
      </div>

      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="song_title" label="歌曲名称" min-width="150" />
        <el-table-column prop="artist" label="歌手" min-width="120" />
        <el-table-column prop="type" label="歌词类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'official' ? 'success' : 'info'">
              {{ row.type === 'official' ? '官方' : '用户上传' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="review_status" label="审核状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="row.review_status === 'approved' ? 'success' : row.review_status === 'rejected' ? 'danger' : 'warning'"
            >
              {{ row.review_status === 'approved' ? '已通过' : row.review_status === 'rejected' ? '已拒绝' : '待审核' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="uploader" label="上传者" width="120" />
        <el-table-column prop="created_at" label="上传时间" width="180" sortable>
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

    <!-- 审核对话框 -->
    <el-dialog v-model="reviewDialogVisible" title="歌词审核" width="600px">
      <el-form :model="reviewForm" label-width="100px">
        <el-form-item label="审核结果">
          <el-radio-group v-model="reviewForm.status">
            <el-radio label="approved">通过</el-radio>
            <el-radio label="rejected">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="reviewForm.status === 'rejected'"
          label="拒绝原因"
          prop="reason"
        >
          <el-input
            v-model="reviewForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入拒绝原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleReviewSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { getLyricList, reviewLyric, deleteLyric } from '@/api/lyric'
import { formatDateTime } from '@/utils/format'
import { PAGINATION } from '@/utils/constants'

const loading = ref(false)
const tableData = ref([])
const reviewDialogVisible = ref(false)
const currentReviewId = ref(null)

const searchForm = reactive({
  keyword: '',
  review_status: '',
  type: ''
})

const reviewForm = reactive({
  status: 'approved',
  reason: ''
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
      review_status: searchForm.review_status || undefined,
      type: searchForm.type || undefined
    }
    const res = await getLyricList(params)
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
  searchForm.type = ''
  handleSearch()
}

const handleCreate = () => {
  // TODO: 跳转到上传歌词页面
  ElMessage.info('功能开发中')
}

const handleView = (row) => {
  // TODO: 查看歌词详情
  ElMessage.info('功能开发中')
}

const handleReview = (row) => {
  currentReviewId.value = row.id
  reviewForm.status = 'approved'
  reviewForm.reason = ''
  reviewDialogVisible.value = true
}

const handleReviewSubmit = async () => {
  if (reviewForm.status === 'rejected' && !reviewForm.reason) {
    ElMessage.warning('请输入拒绝原因')
    return
  }
  try {
    await reviewLyric(currentReviewId.value, reviewForm)
    ElMessage.success('审核成功')
    reviewDialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('审核失败')
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这条歌词吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteLyric(row.id)
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

