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
  index: string;
  productId: string;
  quantity: number;
  name: string;
  specifications?: string;
  price: number;
  cost: number;
  totalCost: number;
  totalPrice: number;
  remark: string;
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