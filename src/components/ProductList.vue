<!-- src/renderer/components/ProductList.vue -->
<script setup lang="ts">
import {useProductStore} from "../utils/store/productStore.ts";
import {Product} from "../types/quotation.ts";

const { products } = useProductStore()

const handleDragStart = (event: DragEvent, product: Product) => {
  event.dataTransfer?.setData('application/json', JSON.stringify({
    type: 'product',
    data: product
  }))
}
</script>

<template>
  <div class="product-grid">
    <div
      v-for="product in products"
      :key="product.id"
      class="product-card"
      draggable="true"
      @dragstart="handleDragStart($event, product)"
    >
      <h3>{{ product.name }}</h3>
      <p>¥{{ product.cost }} / {{ product.unit }}</p>
    </div>
  </div>
</template>

<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.product-card {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
  cursor: grab;
  background: white;
  transition: transform 0.2s;

  &:active {
    cursor: grabbing;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
}
</style>