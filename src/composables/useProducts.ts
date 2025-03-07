import {useElectron} from "./useElectron.ts";
import {ref} from 'vue'

export const useProducts = () => {
  const {invoke} = useElectron()
  const products = ref<Product[]>([])
  const loading = ref(false);
  const searchKeyword = ref('')
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0
  })

  // 获取初始数据
  const loadProducts = async () => {
    loading.value = true;
    const result = await invoke<{
      data: Product[],
      total: number
    }>('products:list', {
      search: searchKeyword.value,
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
    })
    products.value = result.data
    pagination.value.total = result.total
    loading.value = false;
  };


  const addProduct = async (newProduct: Product) => {
    try {
      loading.value = true;
      await invoke('products:insert', newProduct);
    } catch (err) {
      console.error('Insert failed:', err)
    } finally {
      loading.value = false;
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const success = await invoke<boolean>('products:delete', id)
      if (success) {
        products.value = products.value.filter(p => p.id !== id)
      }
      return success
    } catch (error) {
      console.error('Delete failed:', error)
      return false
    } finally {
      loading.value = false;
    }
  }

  const handlePageChange = async (page: number) => {
    pagination.value.page = page
    await loadProducts()
  }

  return {products, deleteProduct, addProduct, loadProducts, loading,handlePageChange, pagination};
}