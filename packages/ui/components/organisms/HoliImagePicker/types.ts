import { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'

export interface ImageInfo {
  uri: string
  blob: File
  base64: string
  height: number
  width: number
}

export interface HoliImagePickerProps {
  buttonProps: Omit<HoliButtonProps, 'children' | 'onPress'>
  onPickImage: (image: ImageInfo) => void
}
