declare interface StoreSchema {
  products: Product[]

  companies: {
    id: string
    name: string
    markupType: 'independent' | 'inherited' // 独立定价或继承定价
    markupRate: number // 基础利润率（如AB的30%）
    parentCompany?: string // 继承的上级公司（如JQ关联AB）
    commissionRate?: number // 需支付的佣金率（如JQ的3%）
    templateConfig: {
      styles: string
      sections: string[]
    }
  }[]

  quotations: Quotation[]
}