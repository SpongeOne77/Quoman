"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
  // You can expose other APTs you need here.
  // ...
});
electron.contextBridge.exposeInMainWorld("electronStore", {
  get: (key) => {
    console.log("inokong store:get");
    return electron.ipcRenderer.invoke("store:get", key);
  },
  set: (key, value) => {
    console.log("invoking store:set");
    return electron.ipcRenderer.invoke("store:set", key, value);
  },
  delete: (key) => electron.ipcRenderer.invoke("store:delete", key),
  onUpdate: (callback) => electron.ipcRenderer.on("store:update", (_, key, value) => callback(key, value)),
  clear: () => electron.ipcRenderer.invoke("store:clear")
});
