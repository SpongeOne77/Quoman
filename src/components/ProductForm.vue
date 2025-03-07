<template>
  <n-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-placement="left"
    label-width="100px"
    class="space-y-6"
  >
    <n-form-item label="商品名称" path="name" required>
      <n-input v-model:value="formData.name" placeholder="请输入商品名称" />
    </n-form-item>

    <n-form-item label="成本价" path="cost" required>
      <n-input-number
        v-model:value="formData.cost"
        :min="0.01"
        :precision="2"
        class="w-full"
      >
        <template #prefix>
          <span class="text-gray-400">¥</span>
        </template>
      </n-input-number>
    </n-form-item>

    <n-form-item label="品牌" path="brand" required>
      <n-input v-model:value="formData.brand" placeholder="请输入供应商品牌" />
    </n-form-item>

    <n-form-item label="SKU" path="sku" required>
      <n-input
        v-model:value="formData.sku"
        placeholder="请输入单位"
        :disabled="mode === 'edit'"
      />
    </n-form-item>

    <n-form-item label="商品规格">
      <n-input
        v-model:value="formData.specs"
        placeholder="请输入唯一商品编号"
        :disabled="mode === 'edit'"
      />
    </n-form-item>

    <n-space justify="end" class="mt-8">
      <n-button @click="$emit('cancel')">取消</n-button>
      <n-button type="primary" @click="handleSubmit" :loading="submitting">
        {{ mode === 'create' ? '创建商品' : '保存更改' }}
      </n-button>
    </n-space>
  </n-form>

  <n-form-item label="缩略图">
    <n-upload
      directory-dnd
      action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
      :max="5"
    >
      <n-upload-dragger>
        <div style="margin-bottom: 12px">
          <n-icon size="48" :depth="3">
          </n-icon>
        </div>
        <n-text style="font-size: 16px">
          点击或者拖动文件到该区域来上传
        </n-text>
        <n-p depth="3" style="margin: 8px 0 0 0">
          请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
        </n-p>
      </n-upload-dragger>
    </n-upload>
  </n-form-item>
</template>

<script setup lang="ts">
import {
  NButton,
  NForm,
  NFormItem,
  NIcon,
  NInput,
  NInputNumber,
  NP,
  NSpace,
  NText,
  NUpload,
  NUploadDragger,
  useMessage
} from 'naive-ui'
import {Product} from "../types/quotation.d.ts";
import {ref, watch} from "vue";

const props = defineProps<{
  mode: 'create' | 'edit'
  data: Product | null
}>()

const emit = defineEmits(['submit', 'cancel'])

const message = useMessage()
const formRef = ref()
const submitting = ref(false)

// 表单验证规则
const rules = {
  name: {required: true, message: '请输入商品名称'},
  specifications: {required: true, message: '请输入型号规格'},
  unit: {required: true, message: '请输入单位'},
  cost: {
    required: true,
    message: '请输入有效的价格'
  }
}

const formData = ref<Product>({
  id: '',
  sku: '',
  name: '',
  cost: 0,
  brand: '',
  specs: '',
  picture: ''
});


// 提交处理
const handleSubmit = async (e: Event) => {
  e.preventDefault()
  submitting.value = true
  try {
    await formRef.value?.validate()
    emit('submit', {
      ...formData.value,
      updatedAt: new Date()
    })
  } catch (errors) {
    message.error('请正确填写表单')
  } finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  formData.value = {
    id: '',
    sku: '',
    name: '',
    cost: 0,
    brand: '',
    specs: '',
    picture: ''
  }
}


watch(() => props.data, (newValue) => {
  if (newValue) {
    formData.value = {
      ...newValue
    }
  } else {
    resetForm()
  }
}, {immediate: true})
</script>
<style scoped lang="css">
.n-form-item :deep(.n-form-item-label) {
  @apply font-medium text-gray-600;
}

.n-input-number :deep(.n-input__input) {
  text-align: left;
}
</style>