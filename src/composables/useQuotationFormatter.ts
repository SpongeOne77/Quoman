import {QuotationItem} from "../types/quotation.ts";
import {computed, Ref} from "vue";

type ExcelRow = Record<string, unknown>
type HeaderMapping = Record<string, keyof QuotationItem>

const DEFAULT_HEADER_MAPPING: HeaderMapping = {
  '序号': 'index',
  '产品名称': 'name',
  '型号规格': 'specifications',
  '单位': 'unit',
  '数量': 'quantity',
  '含税单价': 'cost',
  '单个出售价格': 'price',
  '成本合价': 'totalCost',
  '合价': 'totalPrice',
  '备注': 'remark'
}


export function useQuotationFormatter(
  headerRow: Ref<Record<string, string>>,
  rawData: Ref<ExcelRow[]>
) {
  const columnMap = computed(() => {
    console.log(headerRow)
    const map = new Map<string, keyof QuotationItem>()
    Object.entries(headerRow.value).forEach(([excelKey, chineseName]) => {
      const field = DEFAULT_HEADER_MAPPING[chineseName]
      field && map.set(excelKey, field)
    })
    return map
  })

  const convertValue = (field: keyof QuotationItem, value: unknown) => {
    switch (field) {
      case "index":
      case "cost":
      case "quantity":
      case "price":
      case "totalCost":
      case "totalPrice":
      case "remark":
        return value ? String(value).trim() : undefined
      default:
        return String(value ?? '').trim()
    }
  }

  const formattedData = computed(() => rawData.value.map(row => Array.from(columnMap.value.entries()).reduce((item, [excelKey, field]) => {
    item[field] = convertValue(field, row[excelKey])
    return item
  }, {} as QuotationItem))) || []

  return {
    columnMap,
    formattedData,
  }
}

