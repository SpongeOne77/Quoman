interface Window {
  electron: {
    ipcRenderer: {
      invoke: <T>(channel: string, ...args: any[]) => Promise<T>
      on: (channel: string, listener: (...args: any[]) => void) => () => void,
      off: (channel: string, listener: (...args: any[]) => void) => () => void,
    }
  }
}