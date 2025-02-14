<script setup lang="ts">

import ProductList from "../components/ProductList.vue";
import QuotationBuilder from "../components/QuotationBuilder.vue";
</script>
<template>
  <!--  <ProductManage />-->
  <div class="app-container">
    <main class="main-content">
      <ProductList/>
      <QuotationBuilder/>

    </main>
  </div>
</template>
<style scoped lang="css">
.app-container {
  display: grid;
  grid-template:
    "header header" auto
    "main preview" 1fr
    / 2fr 1fr;
  height: 100vh;
}

.app-header {
  grid-area: header;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #2c3e50;
  color: white;

  nav button {
    margin-left: 1rem;
    padding: 0.5rem 1rem;
    background: #3498db;
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
  }
}

.main-content {
  grid-area: main;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  overflow: auto;
}

.preview-sidebar {
  grid-area: preview;
  padding: 1rem;
  background: #f8f9fa;
  border-left: 1px solid #ddd;
  overflow-y: auto;
}
</style>
