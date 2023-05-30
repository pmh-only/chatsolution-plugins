import { io } from 'https://cdn.socket.io/4.6.0/socket.io.esm.min.js'

class ChatSolutionCore {
  socket = io('wss://chatsolution.shutupandtakemy.codes')

  sendBroadcast (data) {
    return this.socket.emitWithAck('broadcast', data)
  }
  
  onBroadcast (fn = () => {}) {
    this.socket.on('broadcast', fn)
  }

  onConnect (fn = () => {}) {
    this.socket.on('connect', fn)
  }  
}

window.__core = new ChatSolutionCore()
