<script lang="ts" setup>
import {DataTableColumns, DataTableRowKey, NButton, NCard, NDataTable, NImage, NInput} from 'naive-ui'
import {useLocalStore} from "../utils/store/useLocalStore.ts";
import {h, ref} from "vue";
import {RowData} from "naive-ui/es/data-table/src/interface";
import {Product} from "../types/quotation.ts";
import ProductForm from "../components/ProductForm.vue";

const {data} = useLocalStore();

const checkedRows = ref<DataTableRowKey[]>([]);
const handleCheck = (rowKeys: DataTableRowKey[]) => {
  checkedRows.value = rowKeys;
}

const insert = () => {
}
const edit = (rowData) => {
  console.log(rowData);
  currentProduct.value = rowData
  showForm.value = true
}
const batchDelete = (rowData) => {
}

const handleSubmit = (formData: Product) => {
  if (formData.id) {
    // 更新操作
  } else {
    // 新增操作
  }
}

const searchQuery = ref('')
const showForm = ref(false)
const currentProduct = ref<Product>({
  id: '',
  name: '',
  specifications: '',
  cost: 0
})

const createColumns = ({edit, batchDelete}: {
  edit: (row: Product) => void,
  batchDelete: (ids: string[]) => void
}): DataTableColumns<Product> => {
  return [
    {
      title: '缩略图',
      key: 'thumbnail',
      render(row: Product) {
        return h(NImage, {
          width: 40,
          src: row.picture,
          fallbackSrc: 'placeholder.png'
        })
      }
    },
    {title: '名称', key: 'name'},
    {title: '型号规格', key: 'specifications'},
    {title: '单位', key: 'unit'},
    {title: '单价', key: 'cost'},
    {
      title: '操作',
      key: 'actions',
      render: (row: Product) => [
        h(NButton, {
          size: 'small',
          onClick: () => edit(row),
        }, {default: () => '编辑'}),
        h(NButton, {
          size: 'small',
          class: 'ml-2',
          onClick: () => batchDelete([row.id]),
        }, {default: () => '删除'})
      ]
    }
  ]

}

const columns = createColumns({edit, batchDelete});
const rowKey = (row: RowData) => row.id;
</script>
<template>
  <div class="product-management">
    <n-card title="商品管理" class="mb-4">
      <div class="flex justify-between mb-4">
        <n-input
          placeholder="搜索商品..."
          class="w-64"
          clearable
          v-model:value="searchQuery"
        />
        <n-button type="primary" @click="showForm = true">
          <template #icon>
            <i class="i-carbon-add"/>
          </template>
          新增商品
        </n-button>
      </div>

      <n-data-table
        :columns="columns"
        :data="products"
        :bordered="false"
        class="mac-table"
      />
    </n-card>

    <ProductForm
      v-model:show="showForm"
      :product="currentProduct"
      @submit="handleSubmit"
    />
  </div>
</template>
<style scoped lang="css">
</style>