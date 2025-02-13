import { ref } from 'vue';
import type {StoreSchema} from "../../../electron/store.ts";

// 类型声明
declare global {
  interface Window {
    electronStore: {
      get: <K extends keyof StoreSchema>(key: K) => Promise<string>;
      set: <K extends keyof StoreSchema>(key: K, value: string) => Promise<void>;
      delete: (key: keyof StoreSchema) => Promise<void>;
      clear: () => Promise<void>;
      onUpdate: (callback: (key: string, value: unknown) => void) => void;
    };
  }
}

// Vue Composition API 封装
export default function useStore<K extends keyof StoreSchema>(key: K) {
  const data = ref<StoreSchema[K]>();
  const loading = ref(false);
  const error = ref<Error | null>(null);

  // 获取初始数据
  const fetchData = async () => {
    try {
      loading.value = true;
      data.value = JSON.parse(await window.electronStore.get(key));
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  // 自动监听数据变化
  window.electronStore.onUpdate((updatedKey, value) => {
    if (updatedKey === key) {
      data.value = value as StoreSchema[K];
    }
  });

  // 自动初始化
  fetchData();

  // 更新方法
  const update = async (value: StoreSchema[K]) => {
    try {
      await window.electronStore.set(key, JSON.stringify(value));
    } catch (err) {
      console.error(err);
      error.value = err as Error;
    }
  };

  const clearAll = async () => {
    await window.electronStore.clear();
  }

  return {
    data,
    loading,
    error,
    update,
    refresh: fetchData,
    clearAll
  };
}