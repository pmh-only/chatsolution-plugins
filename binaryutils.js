window.__binaryutils = {
  openFile: (accept, isMultiple) =>
    new Promise((resolve) => {
      const fileInput = document.createElement('input')
  
      fileInput.type = "file"
      fileInput.accept = accept
      fileInput.multiple = isMultiple
      fileInput.style.display = "none"
  
      document.body.appendChild(fileInput)
      fileInput.click()
  
      fileInput.onchange = () => {
        document.body.removeChild(fileInput)
  
        resolve(fileInput.files || [])
      }
    }),

  blobToDataURL: (blob) =>
    new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
}
