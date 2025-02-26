import Store from 'electron-store'
import { StoreKeys, StoreValueType } from '/storeKeys.ts'
import {Product, Quotation} from '../types/quotation.ts'

type SchemaType = {
  [StoreKeys.PRODUCTS]: Product[],
  [StoreKeys.QUOTATIONS]: Quotation[],
}

const store = new Store<SchemaType>()

// export function useStore<T extends StoreValueType>(key: T) {
//   return {
//     get: (): SchemaType[T] => {
//
//     }
//   }
// }