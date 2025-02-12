import { ipcRenderer, contextBridge } from 'electron';
import type {StoreSchema} from './store.ts'

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

contextBridge.exposeInMainWorld('electronStore', {
  get: <K extends keyof StoreSchema>(key: K) => ipcRenderer.invoke('store:get', key),
  set: <K extends keyof StoreSchema>(key: K, value: StoreSchema[K]) => ipcRenderer.invoke('store:set', key, value),
  delete: (key: keyof StoreSchema) => ipcRenderer.invoke('store:delete', key),
  onUpdate: (callback: (key: string, value: unknown) => void) => {
    ipcRenderer.on('store:update', (_, key, value) => callback(key, value));
  }
})
