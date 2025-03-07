import {ref, onUnmounted, onMounted} from "vue";

export const useElectron = () => {
  const isElectron = ref(false)

  onMounted(() => {
    isElectron.value = typeof window !== 'undefined' && !!window.electron?.ipcRenderer
  })

  const invoke = <T>(channel: string, ...args: any[]): Promise<T> => {
    if (!isElectron.value) {
      throw new Error('Electron IPC not available in browser environment')
    }
    return window.electron.ipcRenderer.invoke(channel, ...args)
  }

  const on = (channel: string, callback: (...args: any[]) => void) => {
    if (!isElectron.value) return

    const listener = (_: any, args: any[]) => callback(...args)
    window.electron.ipcRenderer.on(channel, listener)

    onUnmounted(() => {
      window.electron.ipcRenderer.off(channel, listener)
    })
  }

  return {
    invoke,
    on,
    isElectron
  }
}