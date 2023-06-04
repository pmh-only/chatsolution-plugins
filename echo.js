if (window.__broadutils === undefined)
  throw new Error('Please import "broadutils" plugin first.')

window.sendEcho = () => {
  const sentAt = Date.now()
  window.__broadutils.sendRequest('echo', 1000)
    .then((echos) => {
      console.log('Connected clients: ' + echos.length)
      console.log('Authors (delay): ' + echos.map((v) => v.author + `(${v.timestamp - sentAt}ms)`).join(', '))
      console.log('Rooms:' + [...new Set(echos.map((v) => v.joinedRoom))].join(', '))
    })
  return 'Echo packet sent...'
}

window.__broadutils.onRequestReceived((data, response) => {
  if (data.type === 'echo')
    response({
      author: window.__basic?.getAuthor?.(),
      room: window.__basic?.getRoom?.()
    })
})
