<template>
  <n-modal v-model:show="show">
    <n-card
      style="width: 600px"
      title="价格维护"
      :bordered="false"
      size="huge"
    >
      <n-form ref="formRef" :model="formData" :rules="rules">
        <n-form-item label="商品名称" path="name">
          <n-input v-model:value="formData.name" />
        </n-form-item>

        <n-grid :cols="2" :x-gap="24">
          <n-form-item-gi label="型号规格" path="model">
            <n-input v-model:value="formData.specifications" />
          </n-form-item-gi>
          <n-form-item-gi label="单位" path="unit">
            <n-input v-model:value="formData.unit" />
          </n-form-item-gi>
        </n-grid>

        <n-grid :cols="3" :x-gap="24">
          <n-form-item-gi label="成本" path="cost">
            <n-input-number v-model:value="formData.cost" :min="0" />
          </n-form-item-gi>
        </n-grid>

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

        <n-form-item label="备注">
          <n-input
            v-model:value="formData.remark"
            type="textarea"
            :autosize="{ minRows: 2 }"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="show = false">取消</n-button>
          <n-button type="primary" @click="handleConfirm">确认</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import {NInput, NCard, NSpace, NModal, NButton, NForm, NInputNumber, NGrid, NFormItemGi, NFormItem, NUpload, NUploadDragger} from 'naive-ui'
import {Product} from "../types/quotation.ts";
import {ref} from "vue";

const props = defineProps<{
  product: Product
}>()
// 表单验证规则
const rules = {
  name: { required: true, message: '请输入商品名称' },
  specifications: { required: true, message: '请输入型号规格' },
  unit: { required: true, message: '请输入单位' },
  cost: {
    required: true,
    message: '请输入有效的价格'
  }
}

const handleConfirm = (form) => {

}

const formData = ref<Product>(props.product);
const show = ref(false);
</script>