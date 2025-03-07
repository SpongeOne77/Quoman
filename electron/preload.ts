import { ipcRenderer, contextBridge } from 'electron';
// import type {StoreSchema} from './store.ts'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
});

contextBridge.exposeInMainWorld('store', {
  clear: () => ipcRenderer.invoke('store:clear')
})

// contextBridge.exposeInMainWorld('productService', {
//   get: <K extends keyof StoreSchema>(key: K) => ipcRenderer.invoke('product:get', key),
//   set: <K extends keyof StoreSchema>(key: K, value: StoreSchema[K]) => ipcRenderer.invoke('product:set', key, value),
//   delete: (key: keyof StoreSchema, id: string) => ipcRenderer.invoke('product:delete', key, id),
//   onUpdate: (callback: (key: string, value: unknown) => void) => ipcRenderer.on('product:update', (_, key, value) => callback(key, value)),
// })

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel: string, ...args:any[]) => ipcRenderer.invoke(channel, ...args),
    on: (channel: string, listener: Function) => {
      const subscription = (_: any, ...args:any[]) => listener(...args)
      ipcRenderer.on(channel, subscription)
      return () => ipcRenderer.removeListener(channel, subscription)
    }
  }
})


contextBridge.exposeInMainWorld('electronAPI', {
  processWithAI: (payload) => ipcRenderer.invoke('process-with-ai', payload)
})