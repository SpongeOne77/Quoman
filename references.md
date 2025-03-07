```js
// src/utils/converters.ts
interface Converter<T, R> {
  (source: T, options?: any): R
}

// 商品转报价项转换器
export const productToQuotationItem: Converter<Product, QuotationItem> = (
  product,
  options = {
    defaultQuantity: 1,
    defaultMarkup: 0.3,
    defaultTaxRate: 0.13
  }
) => ({
  id: generateUUID(),
  productId: product.id,
  productSnapshot: product, // 保存商品快照
  quantity: options.defaultQuantity,
  markupRate: options.defaultMarkup,
  taxRate: options.defaultTaxRate,
  createdAt: new Date()
})

// 使用示例
const quotationItem = productToQuotationItem(product, { 
  defaultMarkup: 0.35 
})
```
```js
// src/hooks/useConverter.ts
type ConverterOptions = {
  pricingStrategy?: 'fixed' | 'tiered'
  currency?: string
}

export const useConverter = () => {
  const { currentCompany } = useStore()
  
  const productToItem = (
    product: Product,
    options?: ConverterOptions
  ): QuotationItem => {
    // 根据公司策略获取默认利润率
    const markup = options?.pricingStrategy === 'tiered' 
      ? calculateTieredMarkup(product)
      : currentCompany.defaultMarkup

    return {
      ...productToQuotationItem(product),
      markupRate: markup,
      currency: options?.currency || 'CNY'
    }
  }

  return {
    productToItem,
    // 可扩展其他转换方法
  }
}
```

推荐转换器架构
1. 分层转换器体系
```js
// 架构示意图
interface Converter<T, R> {
  convert(source: T): R
}

// 基础转换器（纯函数）
class ProductConverter implements Converter<Product, QuotationItem> {
  convert(source: Product): QuotationItem {
    // ...基础转换逻辑
  }
}

// 增强转换器（带业务规则）
class BusinessProductConverter extends ProductConverter {
  constructor(private pricingService: PricingService) {}
  
  convert(source: Product): QuotationItem {
    const base = super.convert(source)
    return {
      ...base,
      markupRate: this.pricingService.calculateMarkup(source)
    }
  }
}

// 使用
const converter = container.get(BusinessProductConverter)
const item = converter.convert(product)
```
2. 类型安全
```js
// 定义转换器类型守卫
function isProductConvertible(
  obj: any
): obj is Converter<Product, QuotationItem> {
  return typeof obj.convert === 'function'
}

// 通用转换管道
class ConversionPipe {
  constructor(private converters: Converter<any, any>[]) {}

  execute<T>(source: T): any {
    return this.converters.reduce((result, converter) => {
      return converter.convert(result)
    }, source)
  }
}
```

第一阶段（必要抽象）：

mermaid
复制
graph LR
A[商品转报价项] --> B[基础转换器]
C[API数据标准化] --> B
D[导出数据转换] --> B
第二阶段（业务增强）：

```js
// 带业务上下文的转换
class ContextAwareConverter {
constructor(
private config: CompanyConfig,
private pricing: PricingStrategy
) {}

convert(product: Product) {
// 使用公司配置和价格策略
    }
}

```
