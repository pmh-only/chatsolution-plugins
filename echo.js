if (window.__broadutils === undefined)
  throw new Error('Please import "broadutils" plugin first.')

window.sendEcho = async () => {
  console.log('Echo packet sent... please wait 5 seconds to collect responses.')
  const sentAt = Date.now()
  const echos = await window.__broadutils.sendRequest('echo', 5 * 1000)

  console.log('Connected clients: ' + echos.length)
  console.log('Authors (delay): ' + echos.map((v) => v.author + `(${v.receivedAt - sentAt}ms)`).join(', '))
  console.log('Rooms:' + [...new Set(echos.map((v) => v.joinedRoom))].join(', '))
}

window.__broadutils.onRequestReceived((data, response) => {
  if (data.type === 'echo')
    response({
      receivedAt: Date.now(),
      author: window.__basic?.getAuthor?.(),
      room: window.__basic?.getRoom?.()
    })
})
