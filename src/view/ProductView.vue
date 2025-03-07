<script lang="ts" setup>
import { h, onMounted, ref} from 'vue'
import {
  NButton,
  NCard,
  NDataTable,
  NIcon,
  NInput,
  NLayout,
  NLayoutContent,
  NModal,
  useDialog,
  useMessage
} from 'naive-ui'
import {Add, Search} from '@vicons/ionicons5'
import {useProducts} from "../composables/useProducts.ts";
import ProductForm from "../components/ProductForm.vue";

const message = useMessage()
const dialog = useDialog()
const {
  products,
  deleteProduct,
  addProduct,
  loadProducts,
  loading,
  handlePageChange,
  pagination
} = useProducts()
const searchKeyword = ref('')
const showFormModal = ref<boolean>(false);
const formState = ref<{
  mode: 'create' | 'edit',
  key: number,
  data?: Product | null
}>({
  mode: 'create',
  key: 0,
  data: null
})

const columns = [
  {
    title: '商品名称',
    key: 'name',
    render: (row: Product) => h('div', {class: 'font-medium'}, row.name)
  },
  {
    title: '品牌',
    key: 'brand',
    render: (row: Product) => h('div', {class: 'font-medium'}, row.brand)
  },
  {
    title: '成本',
    key: 'cost',
    render: (row: Product) => h('div', {class: 'font-medium'}, row.cost)
  },
  {
    title: '单位',
    key: 'sku',
    render: (row: Product) => h('div', {class: 'font-medium'}, row.sku)
  },
  {
    title: '型号规格',
    key: 'specs',
    width: 400,
    render: (row: Product) => h('div', {class: 'font-medium'}, row.specs)
  },
  {
    title: '缩略图',
    key: 'picture',
    render: (row: Product) => h('div', {class: 'font-medium'}, row.picture)
  },
  {
    title: '操作',
    key: 'actions',
    width: 180,
    render: (row: Product) => h('div', {class: 'flex space-x-2'}, [
      h(NButton, {
        size: 'small',
        onClick: () => handleEdit(row)
      }, () => '编辑'),
      h(NButton, {
        size: 'small',
        type: 'error',
        secondary: true,
        onClick: () => handleDelete(row.id)
      }, () => '删除')
    ])
  }
]

// 初始化加载数据
onMounted(async () => {
  loading.value = true
  try {
    await loadProducts()
  } catch (error) {
    message.error('加载商品数据失败')
  } finally {
    loading.value = false
  }
})

// 处理新建商品
const handleCreate = () => {
  formState.value = {
    mode: 'create',
    key: Date.now(),
    data: null
  }
  showFormModal.value = true
}

// 处理编辑商品
const handleEdit = (product: Product) => {
  formState.value = {
    mode: 'edit',
    key: Date.now(),
    data: {...product}
  }
  showFormModal.value = true
}

// 处理删除商品
const handleDelete = async (id: string) => {
  dialog.warning({
    title: '确认删除',
    content: '此操作将永久删除该商品，是否继续？',
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await deleteProduct(id)
        message.success('商品删除成功')
      } catch (error) {
        message.error('删除失败：' + error.message)
      }
    }
  })
}

// 处理表单提交
const handleSubmit = async (formData: Product) => {
  try {
    if (formState.value.mode === 'create') {
      await addProduct(formData)
      message.success('商品创建成功')
    } else {
      await updateProduct(formData)
      message.success('商品更新成功')
    }
    showFormModal.value = false
    await loadProducts()
  } catch (error) {
    message.error(`操作失败: ${error.message}`)
  }
}

let searchTimer: number
const handleSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    pagination.value.page = 1
    loadProducts()
  }, 300)
}
</script>
<template>
  <n-layout class="h-screen">
    <n-layout-content class="p-4 bg-gray-50">
      <div class="mb-4 flex justify-between items-center">
        <n-input
          v-model="searchKeyword"
          placeholder="Search"
          clearable
          class="w-64"
          @clear=""
        >
          <template #prefix>
            <n-icon :component="Search"/>
          </template>
        </n-input>

        <NButton type="primary" @click="handleCreate">
          <template #icon>
            <n-icon :component="Add"/>
          </template>
          新增商品
        </NButton>
      </div>

      <n-data-table
        :data="products"
        :columns="columns"
        :pagination="pagination"
        :loading="loading"
        @update-page="handlePageChange"
        bordered
        remote
        class="shadow-sm"
      />

      <n-modal v-model:show="showFormModal">
        <n-card
          :title="formState.mode === 'create' ? '新增商品' : '编辑商品'"
          class="w-[800px]"
          :bordered="false"
          size="huge">
          <product-form
            :key="formState.key"
            :mode="formState.mode"
            :data="formState.data"
            @submit="handleSubmit"
            @cancel="showFormModal = false"
          />
        </n-card>
      </n-modal>
    </n-layout-content>
  </n-layout>
</template>
<style lang="css" scoped>
/* 自定义表格行高 */
:deep(.n-data-table-tr) {
  height: 60px;
}

/* 优化操作按钮间距 */
.operation-buttons {
  @apply space-x-2;
}

/* 响应式布局 */
@media (max-width: 640px) {
  .search-input {
    @apply w-full;
  }

  :deep(.n-data-table-th),
  :deep(.n-data-table-td) {
    padding: 12px 8px;
  }
}
</style>