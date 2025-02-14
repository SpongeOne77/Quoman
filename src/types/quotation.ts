export interface Quotation {
  id?: string;
  customerName: string;
  date?: Date;
  items: [];
  totalCost: number;
  totalPrice: number;
  profit: number;
}

export interface QuotationItem {
  productId: string;
  quantity: number;
  name: string;
  unitPrice: number;
  unitCost: number;
  totalCost: number;
  totalPrice: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  cost: number;
  unit: string;
  specifications?: string;
  picture?: string;
}