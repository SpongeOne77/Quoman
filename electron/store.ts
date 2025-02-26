import Store from 'electron-store';
import {Product, Quotation} from "../src/types/quotation.ts";



export const store = new Store<StoreSchema>({watch: true});