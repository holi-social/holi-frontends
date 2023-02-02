import { ReactNativeFile } from 'apollo-upload-client'

import { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'

export interface ImageInfo {
  uri: string
  blob: ReactNativeFile
  height: number
  width: number
}

export interface HoliImagePickerProps {
  buttonProps: Omit<HoliButtonProps, 'children' | 'onPress'>
  onPickImage: (image: ImageInfo) => void
  children?: React.ReactNode
}
