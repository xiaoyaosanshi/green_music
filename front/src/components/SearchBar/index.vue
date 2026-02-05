<template>
  <div class="search-bar">
    <el-input
      v-model="keyword"
      placeholder="搜索歌曲、歌手、歌单"
      @keyup.enter="handleSearch"
      @focus="showSuggestions = true"
      @blur="handleBlur"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>
    <div v-if="showSuggestions && (suggestions.length > 0 || history.length > 0)" class="suggestions">
      <div v-if="history.length > 0" class="suggestion-section">
        <div class="section-title">
          <span>搜索历史</span>
          <el-button type="text" size="small" @click="clearHistory">清空</el-button>
        </div>
        <div class="suggestion-list">
          <div
            v-for="item in history"
            :key="item"
            class="suggestion-item"
            @click="handleSelectHistory(item)"
          >
            <el-icon><Clock /></el-icon>
            <span>{{ item }}</span>
            <el-icon class="delete-icon" @click.stop="removeHistory(item)"><Close /></el-icon>
          </div>
        </div>
      </div>
      <div v-if="suggestions.length > 0" class="suggestion-section">
        <div class="section-title">
          <span>搜索建议</span>
        </div>
        <div class="suggestion-list">
          <div
            v-for="item in suggestions"
            :key="item"
            class="suggestion-item"
            @click="handleSelectSuggestion(item)"
          >
            <el-icon><Search /></el-icon>
            <span>{{ item }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'
import { STORAGE_KEYS } from '@/utils/constants'
import { debounce } from '@/utils/format'
import { Search, Clock, Close } from '@element-plus/icons-vue'

const emit = defineEmits(['search'])

const router = useRouter()
const keyword = ref('')
const showSuggestions = ref(false)
const suggestions = ref([])
const history = ref(getStorage(STORAGE_KEYS.SEARCH_HISTORY, []))

// 搜索建议（可以调用API获取）
const fetchSuggestions = debounce((val) => {
  if (!val.trim()) {
    suggestions.value = []
    return
  }
  // TODO: 调用搜索建议API
  suggestions.value = []
}, 300)

watch(keyword, (val) => {
  fetchSuggestions(val)
})

const handleSearch = () => {
  if (!keyword.value.trim()) return

  // 添加到历史记录
  if (!history.value.includes(keyword.value)) {
    history.value.unshift(keyword.value)
    if (history.value.length > 10) {
      history.value = history.value.slice(0, 10)
    }
    setStorage(STORAGE_KEYS.SEARCH_HISTORY, history.value)
  }

  showSuggestions.value = false
  emit('search', keyword.value)
  router.push({
    path: '/search',
    query: { keyword: keyword.value }
  })
}

const handleSelectHistory = (item) => {
  keyword.value = item
  handleSearch()
}

const handleSelectSuggestion = (item) => {
  keyword.value = item
  handleSearch()
}

const removeHistory = (item) => {
  history.value = history.value.filter((h) => h !== item)
  setStorage(STORAGE_KEYS.SEARCH_HISTORY, history.value)
}

const clearHistory = () => {
  history.value = []
  removeStorage(STORAGE_KEYS.SEARCH_HISTORY)
}

const handleBlur = () => {
  // 延迟隐藏，以便点击建议项
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}
</script>

<style lang="scss" scoped>
.search-bar {
  position: relative;
  width: 100%;
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: $spacing-xs;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: $radius-md;
  border: 1px solid rgba(155, 225, 93, 0.2);
  box-shadow: 0 4px 12px rgba(155, 225, 93, 0.15);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
}

.suggestion-section {
  padding: $spacing-md;
  border-bottom: 1px solid rgba(155, 225, 93, 0.2);

  &:last-child {
    border-bottom: none;
  }
}

.section-title {
  @include flex-between;
  margin-bottom: $spacing-sm;
  font-size: $font-size-xs;
  color: $text-secondary;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm;
  border-radius: $radius-sm;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: rgba(155, 225, 93, 0.1);
    color: $primary-start;
  }

  .delete-icon {
    margin-left: auto;
    opacity: 0.5;
    transition: all $transition-fast;

    &:hover {
      opacity: 1;
      color: $primary-start;
    }
  }
}
</style>

