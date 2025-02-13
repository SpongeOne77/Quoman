<script setup lang="ts">
import { ref } from 'vue'
import {Product} from "../types/quotation.ts";
import {FormInst} from "naive-ui";
import {NInput, NFormItem, NForm, NInputNumber, NButton} from 'naive-ui'
import {useProductStore} from '../utils/store/productStore.ts'

const {products, addProduct, clearAll, refresh} = useProductStore();

const formRef = ref<FormInst | null>(null)

defineProps<{ msg: string }>()


const addProductValue = ref<Product>({
  name: '',
  brand: '',
  cost: 0,
  specifications: ''
});
const handleAdd = async (): Promise<void> => {
  await addProduct(addProductValue.value);
  refresh();
}
</script>

<template>
  <n-form
    ref="formRef"
    inline
    :label-width="80"
    :model="addProductValue"
  >
    <n-form-item label="名称" path="name">
      <n-input v-model:value="addProductValue.name" placeholder="输入名称" />
    </n-form-item>
    <n-form-item label="品牌" path="brand">
      <n-input v-model:value="addProductValue.brand" placeholder="输入品牌" />
    </n-form-item>
    <n-form-item label="进价" path="cost">
      <n-input-number v-model:value="addProductValue.cost" placeholder="输入进价" />
    </n-form-item>
    <n-form-item label="规格" path="specifications">
      <n-input v-model:value="addProductValue.specifications" placeholder="输入规格" />
    </n-form-item>
  </n-form>

  <n-button @click="handleAdd">添加</n-button>
  <n-button @click="clearAll">清空</n-button>

  <pre>{{ products }}
</pre>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
