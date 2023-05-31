if (window.__core === undefined)
  throw new Error('Please import core plugin first.')

if (window.__binaryutils === undefined)
  throw new Error('Please import "binaryutils" plugin first.')

if (window.__dialogutils === undefined)
  throw new Error('Please import "dialogutils" plugin first.')

window.sendImage = async () => {
  const files = await window.__binaryutils.openFile('image/*')
  
  for (const file of files) {
    const author = window.__basic?.getAuthor?.()

    window.__core.sendBroadcast({
      type: 'image',
      room: 'sys-binary',
      author,
      fileName: file.name,
      fileUrl: window.__binaryutils.blobToDataURL(file)
    })
  }
}

window.__core.onBroadcast((data) => {
  if (data.type === 'image')
    window.__dialogutils.showDialog(
      `${data.fileName} (by ${data.author || 'Anon'})`,
      `<img width="500" src="${data.fileUrl}">`)
})
