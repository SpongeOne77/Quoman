<script lang="ts" setup>
import {NDataTable} from 'naive-ui'
import {useLocalStore} from "../utils/store/useLocalStore.ts";
import {Product} from "../types/quotation.ts";

const {data} = useLocalStore();

const fieldMapping: { [K in keyof Product]: string } = {
  id: '唯一识别码',
  name: '货品名称',
  brand: '品牌',
  cost: '进价',
  unit: '单位',
  specifications: '规格',
  picture: '示意图',
}
const getColumnsFromInterface = <T>(mapping: { [K in keyof T]: string }): Array<{ title: string, key: keyof T }> => {
  const keys = Object.keys(mapping) as (keyof T)[];
  return keys.map(key => ({
    title: mapping[key as keyof T],
    key: key,
  }))
}

const createColumns = () => getColumnsFromInterface(fieldMapping);

const columns = createColumns()
</script>
<template>
  <div class="product-list-container">
    <n-data-table :columns="columns"
                  :data="products"/>
  </div>
</template>
<style scoped lang="css">
//.product-list-container {
//  //width: 400px;
//}
</style>