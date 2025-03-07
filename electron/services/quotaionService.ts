import {storeService} from "./storeService.ts";
import {ipcMain} from "electron";

export function registerQuotationHandlers() {
  ipcMain.handle('quotations:insert', async (_, quotation: Quotation) => {
    console.log(quotation)
    await storeService.insertEntity('quotations', JSON.parse(quotation))
    return true;
  })

  ipcMain.handle('quotations:list', async (_, params: {
    search?: string
    page?: number
    pageSize?: number
  }) => {
    const { search = '', page = 1, pageSize = 10 } = params
    const searchTerm = search.toLowerCase()

    return storeService.paginate('products', (quotation) => {
      return Object.values(quotation).some(value => String(value).toLowerCase().includes(searchTerm))
    }, page, pageSize)
  })
}