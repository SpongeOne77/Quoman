import Store from 'electron-store';
import {Product, Quotation} from "../src/types/quotation.ts";

export interface StoreSchema {
  quotations: Quotation[];
  products: Product[];
}

export const store = new Store<StoreSchema>();