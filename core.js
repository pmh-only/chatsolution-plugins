const socket = new WebSocket('wss://chatsolution.shutupandtakemy.codes')

window.__core = {
  sendBroadcast: (data) =>
    socket.send(btoa(JSON.stringify(data))),

  onBroadcast: (fn = () => {}) =>
    socket.addEventListener('message', (event) =>
      fn(JSON.parse(atob(event.data)))),

  onConnect: (fn = () => {}) =>
    socket.addEventListener('open', fn)
}
