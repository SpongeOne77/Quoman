<!-- src/renderer/components/QuoteBuilder.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import type {QuotationItem, Product} from "../types/quotation.ts";

const quoteItems = ref<QuotationItem[]>([])

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  const data = event.dataTransfer?.getData('application/json')
  if (!data) return

  try {
    const { type, data: payload } = JSON.parse(data)
    if (type === 'product') {
      addProductToQuote(payload)
    }
  } catch (e) {
    console.error('拖放数据解析失败', e)
  }
}

const addProductToQuote = (product: Product) => {
  const existingItem = quoteItems.value.find(item =>
    item.productId === product.id
  )

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    quoteItems.value.push({
      productId: product.id,
      quantity: 1,
      unitCost: product.cost,
      unitPrice: product.cost,
      name: product.name // 缓存名称防止后续产品修改影响历史报价
    })
  }
}

// 实时计算总价
const totalAmount = computed(() => {
  return quoteItems.value.reduce((sum, item) => {
    return sum + (item.unitPrice * item.quantity)
  }, 0)
})
</script>

<template>
  <div
    class="quote-area"
    @dragover.prevent
    @drop="handleDrop"
  >
    <div class="header">
      <h2>报价单构建区</h2>
      <div class="total">预估总价：¥{{ totalAmount.toFixed(2) }}</div>
    </div>

    <div class="quote-items">
      <div
        v-for="(item, index) in quoteItems"
        :key="index"
        class="quote-item"
      >
        <div class="product-info">
          <span class="name">{{ item.productName }}</span>
          <span class="price">¥{{ item.unitPrice }} ×</span>
        </div>
        <div class="quantity-control">
          <button @click="item.quantity > 1 ? item.quantity-- : quoteItems.splice(index, 1)">
            -
          </button>
          <input
            type="number"
            v-model.number="item.quantity"
            min="1"
          >
          <button @click="item.quantity++">
            +
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
.quote-area {
  border: 2px dashed #ccc;
  min-height: 400px;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.total {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2c3e50;
}

.quote-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  margin: 0.5rem 0;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input {
    width: 50px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.25rem;
  }

  button {
    padding: 0.25rem 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #f8f9fa;
    cursor: pointer;

    &:hover {
      background: #e9ecef;
    }
  }
}
</style>