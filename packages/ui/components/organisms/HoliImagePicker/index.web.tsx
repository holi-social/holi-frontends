import * as ImageManipulator from 'expo-image-manipulator'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { CONTENT_IMAGE_MAX_HEIGHT, CONTENT_IMAGE_MAX_WIDTH } from '@holi/core/constants/constants'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

import type { FileSizeLimitationReject, FileSizeLimitationResize, HoliImageInfo, HoliImagePickerProps } from './types'
import { Button, ButtonIcon } from 'holi-bricks/components/button'
import { Pressable } from 'react-native'

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
        const image = await readImage(fileBlob as File)

        if (!allowsMultipleSelection && fileBlob) {
          if (
            fileBlob.size > (fileSizeLimitation as FileSizeLimitationResize).limitBytes ||
            image.width > CONTENT_IMAGE_MAX_WIDTH ||
            image.height > CONTENT_IMAGE_MAX_HEIGHT
          ) {
            const resizedImage = await resizeImage(
              fileBlob,
              (fileSizeLimitation as FileSizeLimitationResize).resizeWidth
            )
            onPickImage?.(resizedImage)
            return
          } else {
            onPickImage?.(await readImage(fileBlob))
            return
          }
        }

        if (allowsMultipleSelection) {
          const images: HoliImageInfo[] = []
          for (const fileBlob of fileBlobs) {
            if (fileBlob.size > (fileSizeLimitation as FileSizeLimitationResize).limitBytes) {
              images.push(await resizeImage(fileBlob, (fileSizeLimitation as FileSizeLimitationResize).resizeWidth))
            } else {
              images.push(await readImage(fileBlob))
            }
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
        accept=".png,.jpg"
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
