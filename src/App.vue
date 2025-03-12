<script setup lang="ts">
import {NMessageProvider, NLayout,NLayoutSider, NMenu, NLayoutContent, NDialogProvider} from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import {RouterLink} from 'vue-router'
import { defineComponent, h, ref } from 'vue'

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: 'home'
        },
        () => '主页'
      ),
    key: 'go-home',
  },
  {
    key: 'divider-1',
    type: 'divider',
    props: {
      style: {
        marginLeft: '32px'
      }
    }
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: 'ProductPage'
        },
        () => '商品管理'
      ),
    key: 'go-product-page',
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: 'QuotationAdjust'
        },
        () => '报价调整'
      ),
    key: 'go-quotation-adjust',
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: 'QuotationCreator'
        },
        () => '报价创建'
      ),
    key: 'go-quotation-creator',
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: 'QuotationPage'
        },
        () => '报价管理'
      ),
    key: 'go-quotation-page',
  },
]
</script>

<template>
  <n-message-provider>
    <n-dialog-provider>
      <n-layout has-sider class="h-screen">
      <!-- 左侧导航 -->
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        show-trigger
      >
        <n-menu
          :options="menuOptions"
        />
      </n-layout-sider>

      <!-- 主内容区 -->
      <n-layout-content class="bg-gray-50">
        <RouterView />
      </n-layout-content>
    </n-layout>
    </n-dialog-provider>
  </n-message-provider>
</template>

<style lang="css">
@import "style.css";

</style>
