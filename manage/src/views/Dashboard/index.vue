<template>
  <div class="dashboard-container">
    <div class="page-header">
      <h1 class="page-title">仪表盘</h1>
      <p class="page-description">系统数据概览和快捷操作</p>
    </div>

    <!-- 数据概览卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="stat in statistics" :key="stat.key">
        <div class="stat-card">
          <div class="stat-icon" :style="{ background: stat.color }">
            <el-icon :size="24">
              <component :is="stat.icon" />
            </el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ formatNumber(stat.value) }}</div>
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-change" :class="stat.change >= 0 ? 'positive' : 'negative'">
              <el-icon>
                <component :is="stat.change >= 0 ? 'ArrowUp' : 'ArrowDown'" />
              </el-icon>
              {{ Math.abs(stat.change) }}% 较昨日
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">用户增长趋势</span>
            </div>
          </template>
          <div class="chart-container">
            <v-chart :option="userGrowthOption" />
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">播放量趋势</span>
            </div>
          </template>
          <div class="chart-container">
            <v-chart :option="playbackTrendOption" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">音乐类型分布</span>
            </div>
          </template>
          <div class="chart-container">
            <v-chart :option="genreDistributionOption" />
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">热门音乐TOP10</span>
            </div>
          </template>
          <div class="chart-container">
            <v-chart :option="topSongsOption" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷操作 -->
    <el-card class="quick-actions-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">快捷操作</span>
        </div>
      </template>
      <div class="quick-actions">
        <el-button type="primary" :icon="Plus" @click="handleCreateSong">
          上传新音乐
        </el-button>
        <el-button type="warning" :icon="Document" @click="handleReviewLyrics">
          审核待处理歌词
        </el-button>
        <el-button type="info" :icon="ChatLineRound" @click="handleReviewComments">
          查看待审核评论
        </el-button>
        <el-button type="success" :icon="Document" @click="handleViewLogs">
          查看系统日志
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import {
  User,
  Headset,
  VideoPlay,
  ChatLineRound,
  List,
  Plus,
  Document,
  ChatLineRound as ChatIcon
} from '@element-plus/icons-vue'
import { getStatistics } from '@/api/statistics'
import { formatNumber } from '@/utils/format'
import { ElMessage } from 'element-plus'

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const router = useRouter()

const statistics = ref([
  { key: 'users', label: '总用户数', value: 0, change: 0, icon: User, color: '#409EFF' },
  { key: 'songs', label: '总音乐数', value: 0, change: 0, icon: Headset, color: '#67C23A' },
  { key: 'playback', label: '总播放量', value: 0, change: 0, icon: VideoPlay, color: '#E6A23C' },
  { key: 'comments', label: '总评论数', value: 0, change: 0, icon: ChatLineRound, color: '#F56C6C' },
  { key: 'playlists', label: '总歌单数', value: 0, change: 0, icon: List, color: '#9be15d' }
])

const userGrowthOption = ref({})
const playbackTrendOption = ref({})
const genreDistributionOption = ref({})
const topSongsOption = ref({})

const loadStatistics = async () => {
  try {
    const res = await getStatistics()
    if (res.code === 0 && res.data) {
      const data = res.data
      
      // 更新统计数据
      statistics.value[0].value = data.totalUsers || 0
      statistics.value[0].change = data.todayNewUsers || 0
      statistics.value[1].value = data.totalSongs || 0
      statistics.value[1].change = data.todayNewSongs || 0
      statistics.value[2].value = data.totalPlayback || 0
      statistics.value[2].change = data.todayPlayback || 0
      statistics.value[3].value = data.totalComments || 0
      statistics.value[3].change = data.todayNewComments || 0
      statistics.value[4].value = data.totalPlaylists || 0
      statistics.value[4].change = data.todayNewPlaylists || 0
      
      // 设置图表数据（这里使用模拟数据，实际应从API获取）
      initCharts()
    }
  } catch (error) {
    ElMessage.error('加载统计数据失败')
  }
}

const initCharts = () => {
  // 用户增长趋势
  userGrowthOption.value = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: { type: 'value' },
    series: [{
      data: [120, 200, 150, 300, 250, 400],
      type: 'line',
      smooth: true,
      itemStyle: { color: '#9be15d' }
    }]
  }

  // 播放量趋势
  playbackTrendOption.value = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: { type: 'value' },
    series: [{
      data: [820, 932, 901, 934, 1290, 1330],
      type: 'line',
      smooth: true,
      itemStyle: { color: '#00e3ae' }
    }]
  }

  // 音乐类型分布
  genreDistributionOption.value = {
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      data: [
        { value: 1048, name: '流行' },
        { value: 735, name: '摇滚' },
        { value: 580, name: '电子' },
        { value: 484, name: '民谣' },
        { value: 300, name: '其他' }
      ]
    }]
  }

  // 热门音乐TOP10
  topSongsOption.value = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: {
      type: 'category',
      data: ['音乐1', '音乐2', '音乐3', '音乐4', '音乐5', '音乐6', '音乐7', '音乐8', '音乐9', '音乐10']
    },
    yAxis: { type: 'value' },
    series: [{
      data: [120, 200, 150, 80, 70, 110, 130, 90, 100, 95],
      type: 'bar',
      itemStyle: { color: '#9be15d' }
    }]
  }
}

const handleCreateSong = () => {
  router.push({ name: 'SongCreate' })
}

const handleReviewLyrics = () => {
  router.push({ name: 'Lyrics', query: { status: 'pending' } })
}

const handleReviewComments = () => {
  router.push({ name: 'Comments', query: { status: 'pending' } })
}

const handleViewLogs = () => {
  router.push({ name: 'Logs' })
}

onMounted(() => {
  loadStatistics()
})
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: $spacing-lg;
}

.stat-cards {
  margin-bottom: $spacing-lg;
  
  .stat-card {
    @include card();
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-lg;
    
    .stat-icon {
      width: 60px;
      height: 60px;
      @include center();
      border-radius: $border-radius-lg;
      color: $bg-color;
    }
    
    .stat-content {
      flex: 1;
      
      .stat-value {
        font-size: $font-size-xxl;
        font-weight: 600;
        color: $text-primary;
        margin-bottom: $spacing-xs;
      }
      
      .stat-label {
        font-size: $font-size-sm;
        color: $text-secondary;
        margin-bottom: $spacing-xs;
      }
      
      .stat-change {
        font-size: $font-size-xs;
        display: flex;
        align-items: center;
        gap: $spacing-xs;
        
        &.positive {
          color: $success-color;
        }
        
        &.negative {
          color: $danger-color;
        }
      }
    }
  }
}

.chart-row {
  margin-bottom: $spacing-lg;
  
  .chart-card {
    .chart-container {
      height: 300px;
    }
  }
}

.quick-actions-card {
  .quick-actions {
    display: flex;
    gap: $spacing-md;
    flex-wrap: wrap;
  }
}
</style>

