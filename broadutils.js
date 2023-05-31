if (window.__core === undefined)
  throw new Error('Please import core plugin first.')

window.__broadutils = {
  sendRequest: (type = 'echo', timeout = 5 * 1000, extra = {}) =>
    new Promise((resolve) => {
      const requestId = Math.floor(Math.random() * 9000000) + 1000000
      window.__core.sendBroadcast({
        type,
        ...extra,
        requestId,
        room: 'sys-broadutils'
      })

      const datas = []
      window.__core.onBroadcast((data) => {
        if (data.room === 'sys-broadutils' && data.requestId === requestId && !data.isResponse)
          datas.push(data)
      })
      
      setTimeout(() => resolve(datas), timeout)
    }),
  
  onRequestReceived: (fn = () => {}) => {
    window.__core.onBroadcast((data) => {
      function response (extra = {}) {
        window.__core.sendBroadcast({
          ...data,
          ...extra,
          isResponse: true
        })
      }

      if (data.room === 'sys-broadutils')
        fn(data, response)
    })
  }
}
