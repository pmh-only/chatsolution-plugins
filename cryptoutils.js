// from https://gist.github.com/junderw/1d41158403978ba0363e5868d4f434d9

async function aesEncrypt(data, password, difficulty = 10) {
  const hashKey = await grindKey(password, difficulty)
  const iv = await getIv(password, data)

  const key = await window.crypto.subtle.importKey(
    'raw',
    hashKey, {
      name: 'AES-GCM',
    },
    false,
    ['encrypt']
  )

  const encrypted = await window.crypto.subtle.encrypt({
      name: 'AES-GCM',
      iv,
      tagLength: 128,
    },
    key,
    new TextEncoder('utf-8').encode(data)
  )

  const result = Array.from(iv).concat(Array.from(new Uint8Array(encrypted)))

  return base64Encode(new Uint8Array(result))
}

async function aesDecrypt(ciphertext, password, difficulty = 10) {
  const ciphertextBuffer = Array.from(base64Decode(ciphertext))
  const hashKey = await grindKey(password, difficulty)

  const key = await window.crypto.subtle.importKey(
    'raw',
    hashKey, {
      name: 'AES-GCM',
    },
    false,
    ['decrypt']
  )

  const decrypted = await window.crypto.subtle.decrypt({
      name: 'AES-GCM',
      iv: new Uint8Array(ciphertextBuffer.slice(0, 12)),
      tagLength: 128,
    },
    key,
    new Uint8Array(ciphertextBuffer.slice(12))
  )

  return new TextDecoder('utf-8').decode(new Uint8Array(decrypted))
}

function base64Encode(u8) {
  return btoa(String.fromCharCode.apply(null, u8))
}

function base64Decode(str) {
  return new Uint8Array(atob(str).split('').map(c => c.charCodeAt(0)))
}

function grindKey(password, difficulty) {
  return pbkdf2(password, password + password, Math.pow(2, difficulty), 32, 'SHA-256')
}

function getIv(password, data) {
  const randomData = base64Encode(window.crypto.getRandomValues(new Uint8Array(12)))
  return pbkdf2(password + randomData, data + (new Date().getTime().toString()), 1, 12, 'SHA-256')
}

async function pbkdf2(message, salt, iterations, keyLen, algorithm) {
  const msgBuffer = new TextEncoder('utf-8').encode(message)
  const msgUint8Array = new Uint8Array(msgBuffer)
  const saltBuffer = new TextEncoder('utf-8').encode(salt)
  const saltUint8Array = new Uint8Array(saltBuffer)

  const key = await crypto.subtle.importKey('raw', msgUint8Array, {
    name: 'PBKDF2'
  }, false, ['deriveBits'])

  const buffer = await crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt: saltUint8Array,
    iterations: iterations,
    hash: algorithm
  }, key, keyLen * 8)

  return new Uint8Array(buffer)
}

window.__cryptoutils = {
  aesEncrypt,
  aesDecrypt,
  shaHash: async (value) => {
    const valueBuffer = new TextEncoder().encode(value)
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', valueBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    return hashHex
  }
}
