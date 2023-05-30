import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js'

class ChatSolutionCore {
  socket = io('wss://chatsolution.shutupandtakemy.codes')

  sendBroadcast (data, ack = () => {}) {
    this.socket.emit('broadcast', data, ack)
  }
  
  onBroadcast (fn = () => {}) {
    this.socket.on('broadcast', fn)
  }

  onConnect (fn = () => {}) {
    this.socket.on('connect', fn)
  }  
}

window.__core = new ChatSolutionCore()
