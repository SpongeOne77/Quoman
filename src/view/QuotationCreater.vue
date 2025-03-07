<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue'
import draggable from 'vuedraggable'
import {Add, Chatbubble, Pencil, Save, Trash} from '@vicons/ionicons5'
import {useQuotations} from "../composables/useQuotations.ts";
import {useProducts} from "../composables/useProducts.ts";
import {
  NButton,
  NButtonGroup,
  NCard,
  NH2,
  NH3,
  NIcon,
  NInput,
  NInputNumber,
  NLayout,
  NLayoutContent,
  NLayoutSider,
  NSelect,
  NSpin,
  NText,
} from 'naive-ui'

const {createQuotation} = useQuotations()
const {loadProducts, loading: productLoading, products} = useProducts()


const createQuotationItem = (product: Product): QuotationItem => {
  console.log(quotation.value.markupRate)
  const _quotationItem = {
    productId: product.id,
    quantity: 1,
    name: product.name,
    sku: product.sku,
    specs: product.specs || '',
    cost: product.cost,
    remark: '',
    price: Number((product.cost * (1 + quotation.value.markupRate)).toFixed(2))
  }
  console.log('createQuotationItem', _quotationItem)
  return _quotationItem
}


// 组件状态
const searchKeyword = ref('')
const quotation = ref({
  sections: [],
  markupRate: 0.3
} as Quotation)

// 税率选项
const taxOptions = computed(() => [
  {label: '免税', value: 0},
  {label: '6% 增值税', value: 0.06},
  {label: '13% 增值税', value: 0.13}
])

// 获取商品列表
const filteredProducts = computed(() =>
  products.value.filter((p: Product) =>
    p.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchKeyword.value.toLowerCase())
  ))

// 添加模块
const addSection = () => {
  quotation.value.sections.push({
    id: crypto.randomUUID(),
    title: `模块 ${quotation.value.sections.length + 1}`,
    taxRate: 0.13, // 默认税率
    taxedPrice: 0,
    basePrice: 0,
    items: [] as QuotationItem[],
    cost: 0
  })
}

// 删除模块
const removeSection = (index: number) => {
  quotation.value.sections.splice(index, 1)
}

const removeItem = (itemIndex: number, sectionId: string) => {
  console.log(itemIndex, sectionId)
  const sectionIndex = quotation.value.sections.findIndex(q => q.id === sectionId)
  quotation.value.sections[sectionIndex].items.splice(itemIndex, 1)
}

const updateSectionData = () => {
  if (quotation.value.sections.length === 0) {
    return
  }
  for (let i = 0; i < quotation.value.sections.length; i++) {
    const _section = quotation.value.sections[i]
    if (_section.items.length === 0) {
      return 0
    }
    quotation.value.sections[i].basePrice = Number(_section.items.reduce((accumulator, item: QuotationItem) => {
      return accumulator + (item.price * item.quantity)
    }, 0).toFixed(2))
    quotation.value.sections[i].taxedPrice = Number((_section.taxRate * _section.basePrice).toFixed(2))
  }
  quotation.value.untaxedPrice = quotation.value.sections.reduce((accumulator, section) => {
    return accumulator + section.basePrice
  }, 0)
  quotation.value.taxedPrice = Number(quotation.value.sections.reduce((accumulator, section) => {
    return accumulator + (section.basePrice * (1 + section.taxRate))
  }, 0).toFixed(2))
}


// 保存报价
const saveQuotation = async () => {
  await createQuotation(quotation.value)
  // 跳转到报价列表页...
}

onMounted(() => {
  loadProducts()
})

watch(
  () => quotation,
  () => {
    updateSectionData()
    console.log('updated data changes')
  },
  {
    immediate: true,
    deep: true,
  }
)
</script>

<template>
  <n-layout has-sider class="h-screen">
    <!-- 左侧商品面板 -->
    <n-layout-sider
      width="320"
      bordered
      collapse-mode="width"
      :collapsed-width="0"
    >
      <div class="p-4 space-y-4">
        <n-input
          v-model:value="searchKeyword"
          placeholder="搜索商品..."
          clearable
        />
        <n-spin :show="productLoading">
          <div
            class="grid grid-cols-1 gap-2"
          >
            <draggable
              class="drag-area product-group"
              :list="filteredProducts"
              :clone="createQuotationItem"
              :group="{name: 'product', pull: 'clone'}"
              item-key="productId"
            >
              <template #item="{ element }">
                <n-card
                  class="cursor-move draggable-item"
                >
                  <div class="flex justify-between items-center">
                    <span class="font-medium">{{ element.name }}</span>
                    <span class="text-gray-500">¥{{ element.cost }}</span>
                  </div>
                </n-card>
              </template>
            </draggable>

          </div>
        </n-spin>
      </div>
    </n-layout-sider>

    <!-- 右侧报价制作区域 -->
    <n-layout-content class="bg-gray-50 p-6">
      <div class="max-w-4xl mx-auto space-y-6">
        <header class="flex justify-between items-center">
          <n-h2>新报价单</n-h2>
          <n-button type="primary" @click="saveQuotation">
            <template #icon>
              <n-icon>
                <Save/>
              </n-icon>
            </template>
            保存报价
          </n-button>
        </header>
        <n-button @click="addSection">
          <template #icon>
            <n-icon>
              <Add/>
            </n-icon>
          </template>
          添加模块
        </n-button>
        <draggable
          class="product-list"
          :list="quotation.sections"
          group="sections"
          item-key="id"
          draggable="true"
        >
          <template #item="{ element: section, sectionIndex }">
            <div
              class="section-container"
            >
              <n-card class="relative">
                <template #header>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <n-input
                        v-model:value="section.title"
                        placeholder="输入模块标题"
                        class="w-64"
                      />
                      <n-select
                        v-model:value="section.taxRate"
                        :options="taxOptions"
                        style="width: 120px"
                      />
                    </div>
                    <n-button circle type="error" @click="removeSection(sectionIndex)">
                      <n-icon>
                        <Trash/>
                      </n-icon>
                    </n-button>
                  </div>
                </template>

                <!-- 模块内容 -->
                <div class="section-content">
                  <!-- 商品项列表 -->
                  <draggable
                    class="quotation-item"
                    :list="section.items"
                    :group="{name: 'product', pull: 'clone'}"
                    item-key="productId"
                  >
                    <template #item="{ element: item, index: itemIndex }">
                      <div class="item-container">
                        <n-card
                          class="quotation-item-card group"
                          :content-style="{ padding: '16px' }"
                          hoverable
                        >
                          <!-- 头部区域 -->
                          <div class="flex justify-between items-start mb-4">
                            <!-- 产品核心信息 -->
                            <div class="space-y-1">
                              <n-h3 class="!m-0 text-[15px] font-semibold text-gray-900 dark:text-gray-100">
                                {{ item.name }}
                              </n-h3>
                              <n-text depth="3" class="text-[13px]">
                                {{ item.specs || '无' }}
                              </n-text>
                            </div>

                            <!-- 操作按钮组 -->
                            <n-button-group size="small" class="opacity-0 group-hover:opacity-100 transition">
                              <n-button quaternary circle @click="removeItem(itemIndex, section.id)">
                                <template #icon>
                                  <n-icon :component="Trash" class="text-red-500"/>
                                </template>
                              </n-button>
                            </n-button-group>
                          </div>

                          <!-- 核心数据区 -->
                          <div class="grid grid-cols-4 gap-4 mb-4">
                            <!-- 数量控制 -->
                            <div class="space-y-1">
                              <div class="flex items-center gap-1">
                                <n-text depth="3" class="text-xs">数量</n-text>
                                <n-input-number
                                  v-model:value="item.quantity"
                                  :min="1"
                                  size="small"
                                  class="w-20"
                                />
                                <n-text depth="3" class="text-xs">{{ item.sku }}</n-text>
                              </div>
                            </div>

                            <!-- 单价显示 -->
                            <div class="space-y-1">
                              <n-text depth="3" class="text-xs">单价</n-text>
                              <n-text class="font-mono text-sm">
                                ¥{{ item.price }}
                              </n-text>
                            </div>

                            <!-- 合价 -->
                            <div class="space-y-1">
                              <n-text depth="3" class="text-xs">合价</n-text>
                              <n-text class="font-mono text-sm text-primary">
                                ¥{{ item.price * item.quantity }}
                              </n-text>
                            </div>
                          </div>

                          <!-- 备注区域 -->
                          <div v-if="item.remark" class="bg-gray-50 dark:bg-gray-800 rounded p-2">
                            <n-text depth="3" class="text-xs flex items-start">
                              <n-icon :component="Chatbubble" class="mr-1 mt-0.5 flex-shrink-0"/>
                              <span class="leading-relaxed">{{ item.remark }}</span>
                            </n-text>
                          </div>
                        </n-card>
                      </div>
                    </template>
                  </draggable>
                </div>

                <template #footer>
                  <n-text>
                    小计： {{ section.basePrice }}
                  </n-text>
                </template>
              </n-card>
            </div>
          </template>
        </draggable>


        <!-- 总计面板 -->
        <n-card class="sticky bottom-0 bg-white shadow-lg">
          <div class="grid grid-cols-4 gap-4 font-medium">
            <span>总金额（税前）</span>
            <span>总税额</span>
            <span>佣金总额</span>
            <span>最终金额</span>
            <n-text depth="3">¥{{ quotation.untaxedPrice }}</n-text>
            <n-text depth="3">¥{{ quotation.taxedPrice }}</n-text>
            <!--            <n-text depth="3">¥{{ totalCommission.toFixed(2) }}</n-text>-->
            <n-text strong>¥{{ 1 }}</n-text>
          </div>
        </n-card>
      </div>
    </n-layout-content>
  </n-layout>
</template>

<style scoped lang="css">


.draggable-item {
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.section-content {
  position: relative;
  z-index: 2;
}

.item-container {
  position: relative;
  transition: transform 0.2s, opacity 0.2s;
}

.quotation-item-card {
  --primary-color: #007AFF; /* macOS 蓝 */
  --warning-color: #FF9500; /* macOS 橙 */
  --danger-color: #FF3B30; /* macOS 红 */
  --n-border-radius: 10px;
  --n-border-color: rgba(0, 0, 0, 0.06);
  --n-color-embedded: rgba(0, 0, 0, 0.02);
  transition: transform 0.2s ease,
  box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.08);
  }
}

.dark .quotation-item-card {
  --n-border-color: rgba(255, 255, 255, 0.08);
  --n-color-embedded: rgba(255, 255, 255, 0.02);

  &:hover {
    box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.3);
  }
}
</style>