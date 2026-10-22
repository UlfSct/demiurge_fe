export const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<Blob> => {
  return new Promise((resolve) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      img.src = e.target?.result as string
    }

    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height

      const widthRatio = maxWidth / width
      const heightRatio = maxHeight / height

      const ratio = Math.min(widthRatio, heightRatio)

      width = Math.round(width * ratio)
      height = Math.round(height * ratio)

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      if (ctx) {
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)
      }

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
        },
        file.type,
        0.9,
      )
    }

    reader.readAsDataURL(file)
  })
}
