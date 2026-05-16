<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">数据统计</h1>
      <p class="page-description">系统数据统计和分析</p>
    </div>

    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="用户统计" name="users">
        <el-card>
          <div class="chart-container">
            <v-chart :option="userStatisticsOption" />
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="音乐统计" name="songs">
        <el-card>
          <div class="chart-container">
            <v-chart :option="songStatisticsOption" />
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="播放统计" name="playback">
        <el-card>
          <div class="chart-container">
            <v-chart :option="playbackStatisticsOption" />
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="推荐统计" name="recommend">
        <el-card>
          <div class="chart-container">
            <v-chart :option="recommendStatisticsOption" />
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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
import { getUserStatistics, getSongStatistics, getPlaybackStatistics, getRecommendStatistics } from '@/api/statistics'

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

const activeTab = ref('users')
const userStatisticsOption = ref({})
const songStatisticsOption = ref({})
const playbackStatisticsOption = ref({})
const recommendStatisticsOption = ref({})

const loadStatistics = async () => {
  // TODO: 加载统计数据
  // 这里使用模拟数据
  userStatisticsOption.value = {
    title: { text: '用户增长趋势' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
    yAxis: { type: 'value' },
    series: [{ data: [120, 200, 150, 300, 250, 400], type: 'line' }]
  }
  
  songStatisticsOption.value = {
    title: { text: '音乐类型分布' },
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      data: [
        { value: 1048, name: '流行' },
        { value: 735, name: '摇滚' },
        { value: 580, name: '电子' }
      ]
    }]
  }
  
  playbackStatisticsOption.value = {
    title: { text: '播放量趋势' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
    yAxis: { type: 'value' },
    series: [{ data: [820, 932, 901, 934, 1290, 1330], type: 'line' }]
  }
  
  recommendStatisticsOption.value = {
    title: { text: '推荐效果统计' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['准确率', '覆盖率', '点击率', '转化率'] },
    yAxis: { type: 'value' },
    series: [{ data: [85, 70, 60, 45], type: 'bar' }]
  }
}

onMounted(() => {
  loadStatistics()
})
</script>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 500px;
}
</style>

