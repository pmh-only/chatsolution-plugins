/**
 * Chat Solution - Basic plugin.
 * 
 * this contains:
 * * Greet user on connection.
 * * Echo message when sent
 * * Send chat message with author system
 * * Change author name
 * * Very essential Room features.
 */

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

window.a = ([authorName]) => {
  author = authorName
  return { message: 'author name changed' }
}

window.__core.onBroadcast(([message]) => {
  window.__core.sendBroadcast({
    type: 'chat',
    room,
    author,
    message,
    timestamp: Date.now()
  })

  return { message: 'message sent' }
})

window.r = ([roomId]) => {
  room = roomId || undefined
  return { message: 'room changed' }
}
