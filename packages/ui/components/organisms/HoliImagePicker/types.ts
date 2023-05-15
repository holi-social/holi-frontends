import { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'

export interface HoliImageInfo {
  uri: string
  blob: File
  base64?: string | null
  height: number
  width: number
}

export interface HoliImagePickerProps {
  buttonProps: Omit<HoliButtonProps, 'children' | 'onPress'>
  onPickImage: (image: HoliImageInfo) => void
  maxFileSizeInMB?: number
  multiple?: boolean
}
