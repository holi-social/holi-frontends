import React, { useRef } from 'react'

import HoliButton, { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'

import { ImageInfo } from './types'

interface HoliImagePickerProps {
  imagePickerOptions: unknown
  buttonProps: Omit<HoliButtonProps, 'children' | 'onPress'>
  onPickImage: (image: ImageInfo) => void
}

export const HoliImagePicker: React.FC<HoliImagePickerProps> = ({
  children,
  // imagePickerOptions,
  buttonProps,
  onPickImage,
}) => {
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

        <HoliButton {...buttonProps}>{children}</HoliButton>
      </label>
    </>
  )
}
