import { io } from 'https://cdn.socket.io/4.6.0/socket.io.esm.min.js'

const socket = io('wss://ch.pmh.codes')

window.__core = {
  sendBroadcast: (data) => {
    return new Promise((resolve) => {
      socket.emit('broadcast', data, () => resolve())
    })
  },
  onBroadcast: (fn = () => {}) => {
    socket.on('broadcast', fn)
  },
  onConnect: (fn = () => {}) => {
    socket.on('connect', fn)
  }  
}
