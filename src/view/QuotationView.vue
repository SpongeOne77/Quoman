<script lang="ts" setup>
import {useQuotations} from "../composables/useQuotations.ts";
import {computed, onMounted, ref, watchEffect} from "vue";
import {NDatePicker, NGi, NGrid, NInput, NSelect, NTag, NDrawer, NDrawerContent, NButton, NIcon} from 'naive-ui'
import {useScroll} from '@vueuse/core'
import {CloseCircle, Pencil, Search} from '@vicons/ionicons5'
import QuotationCreator from "./QuotationCreator.vue";

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
      new Date(quote.date).getTime() >= dateRange.value[0] &&
      new Date(quote.date).getTime() <= dateRange.value[1]
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

const handleDelete = (id: string) => {
  // 删除逻辑
}

const showDrawer = ref(false)
const draftData = ref<Quotation>(null)
const handleCreateDraft = () => {
  // create draft
  showDrawer.value = true
}

const handleEdit = (quote: Quotation) => {
  // 跳转编辑页面逻辑
  draftData.value = quote
  showDrawer.value = true
}


onMounted(() => {
  loadQuotations()
})
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- 搜索和过滤栏 -->
    <div class="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div class="max-w-7xl mx-auto p-4 flex flex-wrap gap-4 items-center">
        <n-input
          v-model:value="searchKeyword"
          placeholder="搜索报价..."
          class="!rounded-xl shadow-sm"
        >
          <template #prefix>
            <n-icon class="text-slate-400">
              <Search />
            </n-icon>
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
          <n-button @click="handleCreateDraft">
            新增
          </n-button>
        </div>
      </div>
    </div>

<!--    cascading contents-->
    <div class="max-w-7xl mx-auto p-4">
      <n-grid
        x-gap="12"
        y-gap="16"
        responsive="screen"
        :cols="3"
        :cols-sm="2"
        :cols-md="3"
        :cols-lg="4"
        class="relative"
      >
        <n-gi
          v-for="(quote, index) in filteredQuotations"
          :key="quote.id"
          class="relative group"
        >
          <!-- 动态卡片容器 -->
          <div
            class="h-full bg-white rounded-xl shadow-sm hover:shadow-md p-4 border border-slate-100 hover:border-slate-200 transition-all duration-300 hover:z-10"
            :class="{
              '!border-emerald-100': quote.status === 'completed',
              '!border-blue-100': quote.status === 'draft'
            }"
          >
            <!-- 状态指示条 -->
            <div
              class="absolute top-0 left-0 w-full h-1 rounded-t-xl"
              :class="{
                'bg-emerald-500/80': quote.status === 'completed',
                'bg-blue-400/80': quote.status === 'draft'
              }"
            />

            <!-- 内容布局 -->
            <div class="flex flex-col h-full">
              <!-- 头部元信息 -->
              <div class="flex justify-between items-start mb-3">
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-semibold text-slate-900 truncate">
                    {{ quote.title }}
                  </h3>
                  <div class="text-xs text-slate-500 mt-1">
                    <span class="inline-flex items-center">
                      <i class="i-carbon:calendar mr-1 w-3 h-3" />
                      {{ quote.date }}
                    </span>
                  </div>
                </div>
                <n-tag
                  size="tiny"
                  :type="quote.status === 'draft' ? 'info' : 'success'"
                  class="shrink-0"
                  round
                >
                  {{ quote.status === 'draft' ? '草稿' : '已确认' }}
                </n-tag>
              </div>

              <!-- 数据可视化区块 -->
              <div class="mb-3">
                <div class="text-xl font-bold text-emerald-600 mb-1">
                  {{ quote.taxedPrice }}
                </div>
                <div class="h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-emerald-400/80 transition-all duration-500"
                    :style="{ width: `${50}%` }"
                  />
                </div>
              </div>

              <!-- 结构化信息 -->
              <div class="grid grid-cols-2 gap-2 text-xs mb-4">
                <div class="space-y-1">
                  <div class="text-slate-500">甲方</div>
                  <div class="text-slate-800 truncate">{{ quote.client }}</div>
                </div>
                <div class="space-y-1">
                  <div class="text-slate-500">乙方</div>
                  <div class="text-slate-800 truncate">{{ quote.company }}</div>
                </div>
              </div>

              <!-- 上下文操作 -->
              <div class="mt-auto flex justify-between items-center">
                <div class="text-xs text-slate-500 flex items-center">
                  <i class="i-carbon:folder mr-1 w-3.5 h-3.5 text-slate-400" />
                  <span class="truncate">{{ quote.project }}</span>
                </div>
                <div class="absolute inset-0 rounded-xl overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none">
                  <div class="absolute inset-0 bg-black/5 backdrop-blur-[2px]"></div>

                  <!-- 操作按钮容器 -->
                  <div class="absolute bottom-3 right-3 flex gap-2 pointer-events-auto">
                    <!-- 编辑按钮 -->
                    <button
                      @click.stop="handleEdit(quote)"
                      class="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all
                       hover:-translate-y-0.5 border border-slate-100 hover:border-slate-200
                       flex items-center justify-center w-10 h-10"
                    >
<!--                      <i class="i-carbon:edit text-lg text-slate-600 hover:text-blue-500 transition-colors" />-->
                      <n-icon class="text-lg text-slate-600 hover:text-blue-500 transition-colors">
                        <Pencil />
                      </n-icon>
                    </button>

                    <!-- 删除按钮 -->
                    <button
                      @click.stop="handleDelete(quote.id)"
                      class="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all
                       hover:-translate-y-0.5 border border-slate-100 hover:border-slate-200
                       flex items-center justify-center w-10 h-10"
                    >
<!--                      <i class="i-carbon:trash-can text-lg text-slate-600 hover:text-red-500 transition-colors" />-->
                      <n-icon class="text-lg text-slate-600 hover:text-red-500 transition-colors">
                        <CloseCircle />
                      </n-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </n-gi>
      </n-grid>
    </div>

    <!-- 加载状态 -->
    <div
      v-if="loading"
      class="text-center py-4 text-slate-400"
    >
      <i class="i-carbon:loading animate-spin mr-2"/>
      加载中...
    </div>
  </div>
  <n-drawer
    v-model:show="showDrawer"
    placement="right"
    class="edit-drawer shadow-xl"
    default-width="80%"
    :native-scrollbar="false"
    closable
  >
    <quotation-creator :draft-data="draftData" />
  </n-drawer>
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

.edit-drawer {
  --n-body-padding: 24px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>