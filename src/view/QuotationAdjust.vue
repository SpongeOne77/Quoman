<script setup lang="ts">
import { NUpload, NButton, NDataTable, NDivider, useMessage, NCard } from 'naive-ui'
import {ref, computed, h, watch} from 'vue'
import * as XLSX from 'xlsx'
import {QuotationItem} from '../types/quotation.d.ts'
import {useQuotationFormatter} from "../composables/useQuotationFormatter.ts";

const message = useMessage()

interface QuoteComparison {
  id: string
  product: string
  originalPrice: number
  adjustedPrice: number
  reason?: string
}
const headerRow = ref({})
const quoteData = ref<QuotationItem[]>([])
const originalData = ref<QuoteComparison[]>([])
const adjustedData = ref<QuoteComparison[]>([])
const processing = ref(false)
// 合并后的对比数据
const mergedData = computed(() => {
  return originalData.value.map((item, index) => ({
    ...item,
    ...adjustedData.value[index]
  }))
})

// 表格列定义
const comparisonColumns = [
  { title: '产品名称', key: 'product' },
  {
    title: '原始价格',
    key: 'originalPrice',
    render(row: QuoteComparison) {
      return h('span', { class: 'text-gray-600' }, `¥${row.originalPrice}`)
    }
  },
  {
    title: '调整后价格',
    key: 'adjustedPrice',
    render(row: QuoteComparison) {
      const diff = row.adjustedPrice - row.originalPrice
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', {
          class: diff > 0 ? 'text-green-600' : 'text-red-600'
        }, `¥${row.adjustedPrice}`),
        h('span', {
          class: `text-xs ${diff > 0 ? 'text-green-500' : 'text-red-500'}`
        }, `${diff > 0 ? '+' : ''}${(diff / row.originalPrice * 100).toFixed(1)}%`)
      ])
    }
  },
  {
    title: '调整原因',
    key: 'reason',
    render(row: QuoteComparison) {
      return h('div', { class: 'text-gray-500 text-sm' }, row.reason || '系统自动调整')
    }
  }
]

// 处理文件上传
const handleUpload = async ({ file }: any) => {
  try {
    processing.value = true

    // 解析Excel
    const buffer = await file.file.arrayBuffer()
    const workbook = XLSX.read(buffer)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rawData = XLSX.utils.sheet_to_json(sheet)
    headerRow.value = rawData[4]
    // 格式化数据
    quoteData.value = rawData.slice(5, -3);
    const { formattedData } = useQuotationFormatter(headerRow, quoteData);
    originalData.value = formattedData.value.map((item: any) => {
      return {
        id: item['index'] || Math.random().toString(36).substr(2, 9),
        product: item['name'],
        originalPrice: Number(item['totalPrice']),
        adjustedPrice: Number(item['totalPrice']) // 初始值相同
      }
    })
    // 调用AI处理
    adjustedData.value = await window.electronAPI.processWithAI(JSON.stringify({
      originalData: originalData.value,
      instructions: '总体价格调高10%, 但是交换机和PVC管价格需要下调5%'
    }))
    message.success('数据处理完成')
  } catch (error) {
    message.error(`处理失败: ${error.message}`)
  } finally {
    processing.value = false
  }
}

// 行样式处理
const rowClassName = (rowData: QuotationItem) => {
  return rowData.adjustedPrice !== rowData.originalPrice
    ? 'changed-row'
    : ''
}

// 确认修改
const handleConfirm = () => {
  originalData.value = adjustedData.value.map(item => ({
    ...item,
    originalPrice: item.adjustedPrice
  }))
  message.success('修改已确认')
}

// 恢复数据
const handleRollback = () => {
  adjustedData.value = originalData.value.map(item => ({
    ...item,
    adjustedPrice: item.originalPrice
  }))
}

</script>
<template>
  <n-card title="Quotation Adjust" class="mb-4 shadow-sm">
    <n-upload
      accept=".xlsx, .xls"
      :show-file-list="false"
      :disabled="processing"
      @before-upload="handleUpload"
    >
      <n-button type="primary" dashed class="w-full" :loading="processing">
        <template #icon>
          <i class="i-carbon-document-upload text-lg" />
        </template>
        {{  processing ? 'processing...' : 'Upload File'}}
      </n-button>
    </n-upload>

    <n-divider />

    <div v-if="originalData" class="comparison-wrapper">
      <n-data-table
        :columns="comparisonColumns"
        :data="mergedData"
        :bordered="false"
        class="mac-table"
        :row-class-name="rowClassName"
      />
      <div class="action-bar mt-4">
        <n-button @click="handleConfirm">确认修改</n-button>
        <n-button @click="handleRollback">恢复原始数据</n-button>
      </div>
    </div>
  </n-card>
</template>
<style lang="css">
.changed-row td {
  background-color: rgba(255, 251, 235, 0.5); /* bg-yellow-50/50 */
}

.comparison-wrapper {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 0.5rem; /* rounded-lg */
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.action-bar {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 0.5rem 1rem;
  background-color: rgba(249, 250, 251, 0.5); /* bg-gray-50/50 */
}

.mac-table .n-data-table-th {
  background-color: rgba(249, 250, 251, 0.8); /* bg-gray-50/80 */
  -webkit-backdrop-filter: blur(4px); /* backdrop-blur */
  backdrop-filter: blur(4px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
</style>