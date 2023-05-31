if (window.__core === undefined)
  throw new Error('Please import chatsolution core first.')

let author = '익명'
let room = undefined
let alreadyConnected = false

window.__core.onConnect(() => {
  if (alreadyConnected) return
  alreadyConnected = true

  window.__core.sendBroadcast({
    type: 'hello',
    message: 'Someone joined.'
  })
})

window.__core.onBroadcast((data) => {
  if (data.room === undefined || data.room === room)
    console.log(data)
})

window.author = ([authorName]) => {
  author = authorName
  return { message: 'author name changed' }
}

window.chat = ([message]) =>
  window.__core.sendBroadcast({
    type: 'chat',
    room,
    author,
    message,
    timestamp: Date.now()
  })

window.room = ([roomId]) => {
  room = roomId || undefined
  return { message: 'room changed' }
}

// exports for plugin devs.
window.__basic = {
  getAuthor: () => author,
  setAuthor: (newAuthor) => author = newAuthor,
  getRoom: () => room,
  setRoom: (newRoom) => room = newRoom
}
