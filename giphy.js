if (window.__core === undefined)
  throw new Error('Please import core plugin first.')

if (window.__dialogutils === undefined)
  throw new Error('Please import "dialogutils" plugin first.')

let giphykey = ''

window.gsearch = async ([query]) => {
  if (giphykey === '') {
    console.log(`
      ========================
      Please set giphy api key
      ========================

      you can create key from https://developers.giphy.com
      set key "tset\`your secret\`"
    `)
    throw new Error()
  }

  const giphyData = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${giphykey}&q=${query}&limit=4&offset=0&rating=g&lang=en`)
    .then(async (res) => await res.json())
  
  if (giphyData.meta.status !== 200) {
    console.log(`Error to connect giphy api`)
    throw new Error('Error to connect giphy api')
  }

  const images = giphyData.data.map((v) => v.images.original.url)
  window.__dialogutils.showDialog(
    '올릴 짤을 선택 하세요',
    `<details><summary>눌러서 보기/닫기</summary><hr />${images.map((v) => `<img onclick="gsend(\`${v}\`)" width="150" src="${v}">`)}</details>`)
}

window.gset = ([key]) => {
  if (key === '') {
    throw new Error('Thats not my style :(')
  }

  giphykey = key
  console.log(`
    Now you can use giphy api!  
    API Key: ${giphykey}
  `)
}

window.gsend = async (gif) => {
  const author = window.__basic?.getAuthor?.()

  window.__core.sendBroadcast({
    type: 'giphy',
    room: 'giphy',
    author,
    gif
  })
}

window.__core.onBroadcast((data) => {
  if (data.type === 'giphy')
    window.__dialogutils.showDialog(
      `GIPHY IMAGE (by ${data.author || 'Anon'})`,
      `<details><summary>눌러서 보기/닫기</summary><hr /><img width="500" src="${data.gif}"></details>`)
})
