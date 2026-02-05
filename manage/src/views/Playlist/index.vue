<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">歌单管理</h1>
      <p class="page-description">管理平台所有歌单</p>
    </div>

    <el-card>
      <div class="table-toolbar">
        <div class="table-search">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索歌单名、创建者"
            style="width: 300px"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select v-model="searchForm.is_public" placeholder="是否公开" style="width: 120px" clearable>
            <el-option label="全部" value="" />
            <el-option label="公开" :value="1" />
            <el-option label="私密" :value="0" />
          </el-select>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </div>
      </div>

      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column label="封面" width="80">
          <template #default="{ row }">
            <el-image
              :src="row.cover_url || '/default-cover.png'"
              style="width: 60px; height: 60px; border-radius: 4px"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="歌单名称" min-width="150" />
        <el-table-column prop="creator" label="创建者" width="120" />
        <el-table-column prop="song_count" label="音乐数量" width="100" />
        <el-table-column prop="play_count" label="播放次数" width="100" sortable>
          <template #default="{ row }">
            {{ formatPlayCount(row.play_count) }}
          </template>
        </el-table-column>
        <el-table-column prop="favorite_count" label="收藏数" width="100" sortable />
        <el-table-column prop="is_public" label="是否公开" width="100">
          <template #default="{ row }">
            <el-tag :type="row.is_public === 1 ? 'success' : 'info'">
              {{ row.is_public === 1 ? '公开' : '私密' }}
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
            <el-button link type="primary" size="small" @click="handleView(row)">详情</el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
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
import { getPlaylistList, deletePlaylist } from '@/api/playlist'
import { formatDateTime, formatPlayCount } from '@/utils/format'
import { PAGINATION } from '@/utils/constants'

const loading = ref(false)
const tableData = ref([])

const searchForm = reactive({
  keyword: '',
  is_public: ''
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
      is_public: searchForm.is_public !== '' ? searchForm.is_public : undefined
    }
    const res = await getPlaylistList(params)
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
  searchForm.is_public = ''
  handleSearch()
}

const handleView = (row) => {
  // TODO: 查看歌单详情
  ElMessage.info('功能开发中')
}

const handleEdit = (row) => {
  // TODO: 跳转到编辑歌单页面
  ElMessage.info('功能开发中')
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这个歌单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deletePlaylist(row.id)
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

