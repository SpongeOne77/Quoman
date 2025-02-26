import {Product, Quotation} from "../types/quotation.ts";

export const StoreKeys = {
  PRODUCTS: 'product',
  QUOTATIONS: 'quotation',
  SETTINGS: 'settings',
} as const

export type StoreKeyType = keyof typeof StoreKeys
export type StoreValueType = typeof StoreKeys[StoreKeyType];

export interface StoreSchema {
  'quotations': Quotation[];
  'products': Product[];
}