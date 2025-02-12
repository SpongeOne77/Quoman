<script setup lang="ts">
import { ref } from 'vue'
import {Product} from "../types/quotation.ts";
import {FormInst} from "naive-ui";
import {NInput, NFormItem, NForm, NInputNumber} from 'naive-ui'
import useStore from "../utils/store.ts";

const {
  data: quotations,
  loading
} = useStore('quotations');

const formRef = ref<FormInst | null>(null)

defineProps<{ msg: string }>()


const addProductValue = ref<Product>({} as Product);
</script>

<template>
  <h1>{{ msg }}</h1>
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

  <n-button @click="">添加</n-button>

  <pre>{{ JSON.stringify(addProductValue, null, 2) }}
</pre>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
