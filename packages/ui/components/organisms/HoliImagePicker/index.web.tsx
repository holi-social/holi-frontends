import * as ImageManipulator from 'expo-image-manipulator'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

import { HoliImageInfo, HoliImagePickerProps } from './types'

const resizeImage = async (fileBlob: File, resizeWidth: number): Promise<HoliImageInfo> => {
  const fileBlobUri = URL.createObjectURL(fileBlob)
  const resizeActions = [{ resize: { width: resizeWidth } }]
  const resizeSaveOptions = {
    compress: 0.8,
    format: ImageManipulator.SaveFormat.JPEG,
    base64: true,
  }
  const { uri, width, height, base64 } = await ImageManipulator.manipulateAsync(
    fileBlobUri,
    resizeActions,
    resizeSaveOptions
  )
  const response = await fetch(uri)
  const blob = await response.blob()
  const file = new File([blob], fileBlob.name, { type: fileBlob.type, lastModified: fileBlob.lastModified })
  return { uri, base64, blob: file, width, height }
}

const readImage = async (fileBlob: File): Promise<HoliImageInfo> => {
  const reader = new FileReader()
  const readerP = new Promise<string>(
    (resolve) =>
      (reader.onload = () => {
        resolve(reader.result as string)
      })
  )
  const determineDimensionsP = new Promise<{ width: number; height: number }>((resolve) => {
    const img = document.createElement('img')
    img.src = URL.createObjectURL(fileBlob)
    img.onload = () =>
      resolve({
        width: img.width,
        height: img.height,
      })
  })
  const imageInfoP = Promise.all([readerP, determineDimensionsP]).then(([base64, { width, height }]) => ({
    uri: base64,
    base64,
    blob: fileBlob,
    width,
    height,
  }))
  reader.readAsDataURL(fileBlob)
  return imageInfoP
}

const HoliImagePicker = ({
  children,
  buttonProps,
  onPickImage,
  fileSizeLimitation,
}: React.PropsWithChildren<HoliImagePickerProps>) => {
  const { t } = useTranslation()
  const { openToast } = useToast()
  const imageInputNode = useRef<HTMLInputElement>(null)

  const onChangeHandler = async () => {
    const fileBlob = imageInputNode.current?.files?.[0]

    if (!fileBlob) return

    switch (fileSizeLimitation.type) {
      case 'unlimited':
        onPickImage(await readImage(fileBlob))
        return

      case 'resize': {
        if (fileBlob.size > fileSizeLimitation.limitBytes) {
          onPickImage(await resizeImage(fileBlob, fileSizeLimitation.resizeWidth))
          return
        } else {
          onPickImage(await readImage(fileBlob))
          return
        }
      }

      case 'reject': {
        if (fileBlob.size > fileSizeLimitation.limitBytes) {
          openToast(
            t('filePicker.error.maxFileSize', { size: fileSizeLimitation.limitBytes / 1024 / 1024 }),
            HoliToastType.ERROR
          )
          return
        } else {
          onPickImage(await readImage(fileBlob))
          return
        }
      }
    }
  }

  const pickImageHandler = () => imageInputNode.current?.click()

  return (
    <>
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={imageInputNode}
        onChange={onChangeHandler}
        multiple={false}
      />

      <HoliButton {...buttonProps} onPress={pickImageHandler}>
        {children}
      </HoliButton>
    </>
  )
}

export default HoliImagePicker

export type { HoliImagePickerProps }
