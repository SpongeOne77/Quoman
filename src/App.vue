<script setup lang="ts">
import Nav from "./components/layout/Nav.vue";
import {NMessageProvider} from 'naive-ui'

</script>

<template>
  <n-message-provider>
    <Nav></Nav>
    <RouterView class="content"/>
  </n-message-provider>
</template>

<style scoped lang="css">
.content {
  margin-left: 50px;
}
</style>
