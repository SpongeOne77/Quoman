export interface Quotation {
  id?: number;
  customerName: string;
  date?: Date;
  items: [];
  totalCost: number;
  totalPrice: number;
  profit: number;
}

export interface QuotationItem {
  productId: number;
  quantity: number;
  name: string;
  unitPrice: number;
  unitCost: number;
  totalCost: number;
  totalPrice: number;
}

export interface Product {
  id?: number;
  name: string;
  brand: string;
  cost: number;
  specifications?: string;
  picture?: string;
}