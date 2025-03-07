<script setup lang="ts">
import { NMenu, NText, NLayoutHeader } from 'naive-ui'
import { ref, h, Component } from 'vue'
import { RouterLink } from 'vue-router'

const currentKey = ref('quote')
const menuOptions = ref([
  {
    label: '报价管理',
    key: 'quote',
  },
  {
    label: '商品管理',
    key: 'products',
  }
])

// 切换显示内容
const currentView = ref(null)

const handleMenuChange = (key: string) => {
  currentKey.value = key
}
</script>
<template>
  <n-layout-header bordered class="h-12 px-4 flex items-center bg-gray-100/50">
    <div class="flex-1 flex items-center">
      <n-text class="text-xl font-semibold mr-8">Quoman</n-text>
      <n-menu
        mode="horizontal"
        :value="currentKey"
        :options="menuOptions"
        @update-value="handleMenuChange"></n-menu>
    </div>
  </n-layout-header>
</template>
<style scoped lang="css">

</style>
