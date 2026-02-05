<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">音乐管理</h1>
      <p class="page-description">管理平台所有音乐内容</p>
    </div>

    <el-card>
      <!-- 搜索和筛选 -->
      <div class="table-toolbar">
        <div class="table-search">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索歌曲名、歌手名"
            style="width: 300px"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select v-model="searchForm.status" placeholder="状态" style="width: 120px" clearable>
            <el-option label="全部" value="" />
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="0" />
          </el-select>
          <el-select v-model="searchForm.genre" placeholder="类型" style="width: 120px" clearable>
            <el-option label="全部" value="" />
            <el-option label="流行" value="pop" />
            <el-option label="摇滚" value="rock" />
            <el-option label="电子" value="electronic" />
          </el-select>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </div>
        <div>
          <el-button type="primary" :icon="Plus" @click="handleCreate">新增音乐</el-button>
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="selectedIds.length === 0"
            @click="handleBatchDelete"
          >
            批量删除
          </el-button>
        </div>
      </div>

      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column label="封面" width="80">
          <template #default="{ row }">
            <el-image
              :src="row.cover_url || '/default-cover.png'"
              :preview-src-list="[row.cover_url || '/default-cover.png']"
              style="width: 60px; height: 60px; border-radius: 4px"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="歌曲名称" min-width="150" />
        <el-table-column prop="artist" label="歌手" min-width="120" />
        <el-table-column prop="album" label="专辑" min-width="120" />
        <el-table-column prop="genre" label="类型" width="100" />
        <el-table-column prop="play_count" label="播放量" width="100" sortable>
          <template #default="{ row }">
            {{ formatPlayCount(row.play_count) }}
          </template>
        </el-table-column>
        <el-table-column prop="rating" label="评分" width="80" sortable>
          <template #default="{ row }">
            {{ row.rating ? row.rating.toFixed(1) : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" sortable>
          <template #default="{ row }">
            {{ formatDateTime(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button
              link
              :type="row.status === 1 ? 'warning' : 'success'"
              size="small"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 1 ? '下架' : '上架' }}
            </el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
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
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Delete } from '@element-plus/icons-vue'
import { getSongList, deleteSong, updateSongStatus, batchOperateSongs } from '@/api/song'
import { formatDateTime, formatPlayCount } from '@/utils/format'
import { PAGINATION } from '@/utils/constants'

const router = useRouter()

const loading = ref(false)
const tableData = ref([])
const selectedIds = ref([])

const searchForm = reactive({
  keyword: '',
  status: '',
  genre: ''
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
      status: searchForm.status !== '' ? searchForm.status : undefined,
      genre: searchForm.genre || undefined
    }
    const res = await getSongList(params)
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
  searchForm.status = ''
  searchForm.genre = ''
  handleSearch()
}

const handleCreate = () => {
  router.push({ name: 'SongCreate' })
}

const handleEdit = (row) => {
  router.push({ name: 'SongEdit', params: { id: row.id } })
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这首音乐吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteSong(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 首音乐吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await batchOperateSongs({ ids: selectedIds.value, action: 'delete' })
    ElMessage.success('删除成功')
    selectedIds.value = []
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleToggleStatus = async (row) => {
  try {
    const newStatus = row.status === 1 ? 0 : 1
    await updateSongStatus(row.id, newStatus)
    ElMessage.success('操作成功')
    loadData()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.id)
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

