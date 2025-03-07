declare interface Quotation {
  id: string;
  title: string;
  project: string;
  client: string;
  company: string;
  status: 'completed' | 'draft';
  date?: Date;
  sections: {
    id: string;
    title: string;
    taxRate: number;
    basePrice: number;
    taxedPrice: number;
    cost: number;
    items: QuotationItem[];
  }[];
  cost: number;
  untaxedPrice: number;
  taxedPrice: number;
  markupRate: number;
}

declare interface QuotationItem {
  productId: string;
  quantity: number;
  name: string;
  sku: string;
  specs?: string;
  price: number;
  cost: number;
  remark: string;
}

declare interface Product {
  id: string;
  name: string;
  brand: string;
  cost: number;
  sku: string;
  specs?: string;
  picture?: string;
}