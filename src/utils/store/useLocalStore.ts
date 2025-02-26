import useStore from './store.ts';

export const useLocalStore = <T>() => {
  const { data: T, update, ...rest } = useStore('products');

  // 创建产品
  const insert = async (item: T) => {
    const newItem: T = {
      ...item,
      id: crypto.randomUUID(),
    };
    await update([...(item.value || []), newItem] as T[]);
    return newItem;
  };

  return {
    data,
    insert,
    ...rest
  };
};