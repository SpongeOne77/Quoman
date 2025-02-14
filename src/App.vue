<script setup lang="ts">
import Nav from "./components/layout/Nav.vue";

</script>

<template>
  <Nav></Nav>
<!--  <div>-->
<!--    <a href="https://electron-vite.github.io" target="_blank">-->
<!--      <img src="/electron-vite.svg" class="logo" alt="Vite logo" />-->
<!--    </a>-->
<!--    <a href="https://vuejs.org/" target="_blank">-->
<!--      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />-->
<!--    </a>-->
<!--  </div>-->
  <RouterView class="content" />
</template>

<style scoped lang="css">
.content {
  margin-left: 50px;
}
</style>
