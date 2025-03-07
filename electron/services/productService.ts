import {ipcMain} from "electron";
import {storeService} from "./storeService.ts";
// import {Product} from "../../src/types/quotation.d.ts";

export function registerProductServices() {
  // 统一查询接口（支持搜索和分页）
  ipcMain.handle('products:list', async (_, params: {
    search?: string
    page?: number
    pageSize?: number
  }) => {
    const { search = '', page = 1, pageSize = 10 } = params
    const searchTerm = search.toLowerCase()

    return storeService.paginate('products', (product) => {
      return Object.values(product).some(value => String(value).toLowerCase().includes(searchTerm))
    }, page, pageSize)
  })

  ipcMain.handle('products:insert', async (_, product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: crypto.randomUUID()
    }
    await storeService.insertEntity('products', newProduct)
    return true
  })

  ipcMain.handle('products:update', async (_, product) => {
    await storeService.updateEntity('products', product.id, () => product)
    return true
  })

  ipcMain.handle('products:delete', async (_, id: string) => {
    const products = storeService.store.get('products')
    const index = products.findIndex((p: Product) => p.name === id)

    if (index === -1) {
      throw new Error(`Product with id ${id} not found`)
    }

    const updated = [...products]
    updated.splice(index, 1)
    storeService.store.set('products', updated)
    return true
  })
}