<script lang="ts" setup>
import {useQuotations} from "../composables/useQuotations.ts";
import {computed, onMounted, ref, watchEffect} from "vue";
import {NButton, NDatePicker, NGi, NGrid, NInput, NPopconfirm, NSelect, NTag} from 'naive-ui'
import {useScroll} from '@vueuse/core'

const {quotations, loadQuotations, pagination, loading, searchKeyword} = useQuotations()

const filterStatus = ref<string | null>(null)
const dateRange = ref<[number, number] | null>(null)

const statusOptions = [
  {

  }
]

const filteredQuotations = computed(() => {
  return quotations.value.filter(quote => {
    const matchesKeyword = quote.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) || quote.project.toLowerCase().includes(searchKeyword.value.toLowerCase())
    const matchesStatus = !filterStatus.value || quote.status === filterStatus.value
    const matchesDate = !dateRange.value || (
      new Date(quote.updatedAt).getTime() >= dateRange.value[0] &&
      new Date(quote.updatedAt).getTime() <= dateRange.value[1]
    )

    return matchesStatus && matchesDate && matchesKeyword
  })
})

// scroll down related
const {arrivedState} = useScroll(document, {offset: {bottom: 100}})
watchEffect(() => {
  if (arrivedState.bottom && !loading.value && pagination.value.hasMore) {
    loadMoreData()
  }
})

const loadMoreData = () => {
  pagination.value.page++
  loadQuotations()
}

const handlePreview = (quote: Quote) => {
  // 打开预览弹窗逻辑
}

const handleEdit = (quote: Quote) => {
  // 跳转编辑页面逻辑
}

const handleDelete = (id: string) => {
  // 删除逻辑
}
onMounted(() => {
  loadQuotations()
})
</script>

<template>
  <div class="min-h-screen bg-slate-100/50">
    <!-- 搜索和过滤栏 -->
    <div class="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-white/20">
      <div class="max-w-7xl mx-auto p-4 space-y-4">
        <n-input
          v-model:value="searchKeyword"
          placeholder="搜索报价..."
          class="!rounded-xl shadow-sm"
        >
          <template #prefix>
            <i class="i-carbon:search text-slate-400"/>
          </template>
        </n-input>

        <div class="flex gap-3 flex-wrap">
          <n-select
            v-model:value="filterStatus"
            :options="statusOptions"
            placeholder="状态过滤"
            class="!w-32 !rounded-xl"
            clearable
          />
          <n-date-picker
            v-model:value="dateRange"
            type="daterange"
            clearable
            class="!rounded-xl"
            placeholder="选择日期范围"
          />
        </div>
      </div>
    </div>

    <!-- 瀑布流列表 -->
    <n-grid
      x-gap="16"
      y-gap="20"
      :cols="1"
      responsive="screen"
      :cols-md="2"
      :cols-lg="3"
      :cols-xl="4"
      class="p-6"
    >
      <n-gi
        v-for="quote in filteredQuotations"
        :key="quote.id"
        class="group transition-all duration-300"
      >
        <div
          class="h-full bg-white/30 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl p-5 border border-white/20 hover:border-white/40 transition-all duration-300 hover:-translate-y-1.5"
        >
          <!-- 头部区域 -->
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-semibold text-slate-800 truncate">
              {{ quote.name }}
              <n-tag
                v-if="quote.status === 'draft'"
                size="small"
                type="info"
                class="ml-2"
              >草稿
              </n-tag
              >
            </h3>
            <div class="text-2xl font-bold text-emerald-600">
              {{ quote.taxedPrice }}
            </div>
          </div>

          <!-- 主体内容 -->
          <div class="space-y-2.5 text-slate-600">
            <div class="flex items-center">
              <i class="i-carbon:folder text-slate-400 mr-2 w-4 h-4"/>
              <span class="truncate">{{ quote.project }}</span>
            </div>
            <div class="flex items-center">
              <i class="i-carbon:user-avatar text-sky-400 mr-2 w-4 h-4"/>
              <span class="truncate">{{ quote.client }}</span>
            </div>
            <div class="flex items-center">
              <i class="i-carbon:user-profile text-purple-400 mr-2 w-4 h-4"/>
              <span class="truncate">{{ quote.company }}</span>
            </div>
          </div>

          <!-- 底部操作栏 -->
          <div class="mt-4 pt-3 border-t border-white/20 flex justify-between items-center">
            <div class="text-xs text-slate-400 flex items-center">
              <i class="i-carbon:calendar mr-1.5 w-3.5 h-3.5"/>
              {{ quote.date }}
            </div>
            <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <n-button
                text
                class="!p-1 !text-slate-500 hover:!text-emerald-500"
                @click="handlePreview(quote)"
              >
                <i class="i-carbon:view text-lg"/>
              </n-button>
              <n-button
                text
                class="!p-1 !text-slate-500 hover:!text-blue-500"
                @click="handleEdit(quote)"
              >
                <i class="i-carbon:edit text-lg"/>
              </n-button>
              <n-popconfirm
                @positive-click="handleDelete(quote.id)"
              >
                <template #trigger>
                  <n-button
                    text
                    class="!p-1 !text-slate-500 hover:!text-red-500"
                  >
                    <i class="i-carbon:trash-can text-lg"/>
                  </n-button>
                </template>
                确定要删除这个报价吗？
              </n-popconfirm>
            </div>
          </div>
        </div>
      </n-gi>
    </n-grid>

    <!-- 加载状态 -->
    <div
      v-if="loading"
      class="text-center py-4 text-slate-400"
    >
      <i class="i-carbon:loading animate-spin mr-2"/>
      加载中...
    </div>
  </div>
</template>

<style scoped lang="css">
html {
  scroll-behavior: smooth;
}

/* 下拉加载动画 */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}


.n-grid {
  --n-gap: 1rem;
  animation: fade-in 0.3s ease-out;
}

.group:hover .hover-effect {
  opacity: 1;
}
</style>