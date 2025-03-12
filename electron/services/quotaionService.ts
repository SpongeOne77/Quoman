import {storeService} from "./storeService.ts";
import {ipcMain} from "electron";

export function registerQuotationHandlers() {
  ipcMain.handle('quotations:insert', async (_, quotation: Quotation) => {
    console.log(quotation)
    await storeService.insertEntity('quotations', JSON.parse(quotation as string))
    return true;
  })

  ipcMain.handle('quotations:list', async (_, params: {
    search?: string
    page?: number
    pageSize?: number
  }) => {
    const { search = '', page = 1, pageSize = 10 } = params
    const searchTerm = search.toLowerCase()

    return storeService.paginate('quotations', (quotation) => {
      return Object.values(quotation).some(value => String(value).toLowerCase().includes(searchTerm))
    }, page, pageSize)
  })

  ipcMain.handle('quotations:delete', async (_, id: string) => {
    const quotations = storeService.store.get('quotations')
    const index = quotations.findIndex((p: Quotation) => p.id === id)

    if (index === -1) {
      throw new Error(`Quotation with id ${id} not found`)
    }

    const updated = [...quotations]
    updated.splice(index, 1)
    storeService.store.set('quotations', updated)
    return true
  })
}