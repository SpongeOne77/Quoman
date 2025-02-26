import { ipcMain } from 'electron'
import {aiService} from "../../src/lib/apiClient.ts";

export function initAiProcessor() {
  ipcMain.handle('process-with-ai', async (_, payload) => {
    try {
      const startTime = Date.now();
      const result = await aiService.processQuotation(JSON.parse(payload));
      console.log(`[AiProcessor] AI处理耗时: ${Date.now() - startTime}ms`);
      return result
    } catch (error) {
      console.error('[AiProcessor] AI处理失败详情: ', {
        code: error.code,
        message: error.message,
        stack: error.stack
      })
      throw new Error(`[AiProcessor] AI处理失败: ${error.message}`)
    }
  })
}