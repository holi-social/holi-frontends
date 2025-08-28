import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

import type { FileSizeLimitationReject, HoliImageInfo, HoliImagePickerProps } from './types'
import { Button, ButtonIcon } from 'holi-bricks/components/button'
import { Pressable } from 'react-native'

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
  buttonProps,
  children,
  buttonIconProps,
  onPickImage,
  onPickImages,
  fileSizeLimitation,
  allowsMultipleSelection = false,
  buttonIconOnly,
}: HoliImagePickerProps) => {
  const { t } = useTranslation()
  const { openToast } = useToast()
  const imageInputNode = useRef<HTMLInputElement>(null)

  const onChangeHandler = async () => {
    const files = imageInputNode.current?.files

    const fileBlobs = Array.from(files || []).slice(0, 3)

    const fileBlob = imageInputNode.current?.files?.[0]

    if (!fileBlobs.length) return

    switch (fileSizeLimitation.type) {
      case 'unlimited':
        if (!allowsMultipleSelection && fileBlob) {
          onPickImage?.(await readImage(fileBlob))
          return
        }

        if (allowsMultipleSelection) {
          const images: HoliImageInfo[] = []
          for (const fileBlob of fileBlobs) {
            images.push(await readImage(fileBlob))
          }
          onPickImages?.(images)
          return
        }
        break

      case 'resize': {
        // Skip resizing on web - let the server handle it to avoid format conversion issues
        if (!allowsMultipleSelection && fileBlob) {
          onPickImage?.(await readImage(fileBlob))
          return
        }

        if (allowsMultipleSelection) {
          const images: HoliImageInfo[] = []
          for (const fileBlob of fileBlobs) {
            images.push(await readImage(fileBlob))
          }
          onPickImages?.(images)
          return
        }
        break
      }

      case 'reject': {
        if (!allowsMultipleSelection && fileBlob) {
          if (fileBlob.size > (fileSizeLimitation as FileSizeLimitationReject).limitBytes) {
            openToast(
              t('filePicker.error.maxFileSize', {
                size: (fileSizeLimitation as FileSizeLimitationReject).limitBytes / 1024 / 1024,
              }),
              HoliToastType.ERROR
            )
            return
          } else {
            onPickImage?.(await readImage(fileBlob))
            return
          }
        }
        if (allowsMultipleSelection) {
          const images: HoliImageInfo[] = []
          for (const fileBlob of fileBlobs) {
            if (fileBlob.size > (fileSizeLimitation as FileSizeLimitationReject).limitBytes) {
              openToast(
                t('filePicker.error.maxFileSize', {
                  size: (fileSizeLimitation as FileSizeLimitationReject).limitBytes / 1024 / 1024,
                }),
                HoliToastType.ERROR
              )
              return
            } else {
              images.push(await readImage(fileBlob))
            }
          }
          onPickImages?.(images)
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
        accept="image/jpeg,image/jpg,image/png"
        style={{ display: 'none' }}
        ref={imageInputNode}
        onChange={onChangeHandler}
        multiple={allowsMultipleSelection}
      />

      {buttonProps && !buttonIconOnly && !children && <Button {...buttonProps} onPress={pickImageHandler} />}
      {buttonIconProps && buttonIconOnly && !children && <ButtonIcon {...buttonIconProps} onPress={pickImageHandler} />}
      {buttonProps && children && (
        <Pressable {...buttonProps} onPress={pickImageHandler}>
          {children}
        </Pressable>
      )}
    </>
  )
}

export default HoliImagePicker

export type { HoliImagePickerProps }
