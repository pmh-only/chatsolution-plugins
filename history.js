if (window.__broadutils === undefined)
  throw new Error('Please import "broadutils" plugin first.')

let histories = []
let disabled = false

window.sendHistoryRequest = async () => {
  console.log('Histroy request packet sent...')
  const histories = (await window.__broadutils.sendRequest('history', 1000))
    .map((v) => v.histories)
    .flat()
    .sort((a, b) => a.timestamp - b.timestamp)
  
  const dupsRemovedHistories = []

  for (const history of histories) {
    if (!dupsRemovedHistories.find((v) => v.timestamp === history.timestamp)) {
      dupsRemovedHistories.push(history)
      console.log({ ...history, type: 'history' })
    }
  }
}

window.__broadutils.onRequestReceived((data, response) => {
  if (disabled) return
  if (data.type === 'history')
    response({ histories })
})

window.__core.onBroadcast((data) => {
  if (disabled) return
  if (data.type === 'chat' && !data.room) {
    histories.push(data)
    
    if (histories.length > 10)
      histories.splice(0, 1)
  }
})

window.__history = {
  _unload: () => {
    window.sendHistoryRequest = undefined
    disabled = true
    histories = []
  }
}
