if (window.__core === undefined)
  throw new Error('Please import chatsolution core first.')
  
if (window.__cryptoutils === undefined)
  throw new Error('Please import "cryptoutils" plugin first.')

let eroompass = ''  
let eroomhash = ''

window.__core.onBroadcast(async (data) => {
  if (data.type === 'echat' && data.eroomhash === eroomhash) {
    const decrypted =
      await window.__cryptoutils.aesDecrypt(data.encrypted, eroompass)
        .catch(() => '')

    console.log({ ...data, encrypted: undefined, decrypted, eroomhash: undefined })
  }
})

window.eroom = async ([eroom]) => {
  if (eroom.length < 5) {
    console.log('Fatal: eroom must be longer than 5 character.')
    return
  }

  eroompass = eroom
  eroomhash = await window.__cryptoutils.shaHash(eroom)
}

window.echat = async ([chat]) => {
  if (!eroompass) {
    console.log('Fatal: eroom must be set before send encrypt message. use eroom`<room_id>` to set.')
    return
  }

  const encrypted = await window.__cryptoutils.aesEncrypt(chat, eroompass)

  window.__core.sendBroadcast({
    type: 'echat',
    room: 'sys-encrypted',
    eroomhash,
    encrypted
  })
}
