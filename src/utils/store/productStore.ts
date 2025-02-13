import useStore from './store.ts';
import type {Product} from '../../types/quotation.ts'

export const useProductStore = () => {
  const { data: products, update, ...rest } = useStore('products');

  // 创建产品
  const addProduct = async (product: Product) => {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
    };
    await update([...(products.value || []), newProduct] as Product[]);
    return newProduct;
  };

  const clearAll = async () => {

  }

  return {
    products,
    addProduct,
    ...rest
  };
};