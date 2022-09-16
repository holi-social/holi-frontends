import React, { useRef } from 'react'

import HoliButton from '@holi/ui/components/molecules/HoliButton'

import { HoliImagePickerProps } from './types'

const HoliImagePicker: React.FC<HoliImagePickerProps> = ({ children, buttonProps, onPickImage }) => {
  const imageInputNode = useRef<HTMLInputElement>(null)

  const onChangeHandler = async () => {
    const fileBlob = imageInputNode.current?.files?.[0]
    const reader = new FileReader()

    if (!fileBlob) return

    Promise.all([
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
    ]).then(([base64, { width, height }]) => onPickImage({ uri: base64, base64, blob: fileBlob, width, height }))

    reader.readAsDataURL(fileBlob)
  }

  const pickImageHandler = () => imageInputNode.current?.click()

  return (
    <>
      <input type="file" accept="image/*" style={{ display: 'none' }} ref={imageInputNode} onChange={onChangeHandler} />

      <HoliButton {...buttonProps} onPress={pickImageHandler}>
        {children}
      </HoliButton>
    </>
  )
}

export default HoliImagePicker

export type { HoliImagePickerProps }
