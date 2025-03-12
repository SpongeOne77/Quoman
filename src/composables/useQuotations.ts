import {useElectron} from "./useElectron.ts";
import {ref} from 'vue'

export const useQuotations = () => {
  const {invoke} = useElectron()
  const quotations = ref<Quotation[]>([])
  const loading = ref(false)
  const searchKeyword = ref('')
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0,
    hasMore: false,
  })


  // 获取初始数据
  const loadQuotations = async () => {
    loading.value = true;
    const result = await invoke<{
      data: Quotation[],
      total: number,
      hasMore: boolean,
    }>('quotations:list', {
      search: searchKeyword.value,
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
    })
    console.log(result)
    quotations.value = result.data
    pagination.value.total = result.total
    pagination.value.hasMore = result.hasMore
    loading.value = false;
  };


  const createQuotation = async (newQuotation: Quotation) => {
    try {
      loading.value = true;
      await invoke('quotations:insert', JSON.stringify(newQuotation))
    } catch (err) {
      console.error('Insert failed:', err)
    } finally {
      loading.value = false;
    }
  }

  const deleteQuotation = async (id: string) => {
    try {
      const success = await invoke<boolean>('quotations:delete', id)
      if (success) {
        quotations.value = quotations.value.filter(p => p.id !== id)
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
    await loadQuotations()
  }

  return {quotations, deleteQuotation, createQuotation, loadQuotations, loading,handlePageChange, pagination, searchKeyword};
}