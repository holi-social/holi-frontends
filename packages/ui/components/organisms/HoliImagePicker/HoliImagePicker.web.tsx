import React, { useRef } from 'react'

interface HoliImagePickerProps {
  imagePickerOptions: unknown
  getChildren: (actionHandler: () => Promise<unknown | undefined>) => React.ReactNode
}

export const HoliImagePicker: React.VFC<HoliImagePickerProps> = ({ getChildren }) => {
  const imageInputNode = useRef<HTMLInputElement>(null)

  const onChangeHandler = async () => {
    const fileBlob = imageInputNode.current?.files?.[0]
    const reader = new FileReader()

    if (!fileBlob) return

    const promise = Promise.all([
      new Promise<string>(
        (resolve) =>
          (reader.onload = () => {
            resolve(reader.result as string)
          })
      ),
      new Promise<{ width: number; height: number }>((resolve) => {
        const img = document.createElement('img')
        img.src = URL.createObjectURL(fileBlob)
        img.onload = () =>
          resolve({
            width: img.width,
            height: img.height,
          })
      }),
    ]).then(([base64, { width, height }]) => console.log({ image: base64, width, height }))

    reader.readAsDataURL(fileBlob)

    return promise
  }

  return (
    <>
      <label>
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={imageInputNode}
          onChange={onChangeHandler}
        />

        {getChildren(async () => undefined)}
      </label>
    </>
  )
}
