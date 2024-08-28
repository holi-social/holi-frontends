import { ReactNativeFile } from '@holi/api/graphql/client'
import { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'

export interface HoliImageInfo {
  uri: string
  blob: ReactNativeFile | File
  base64?: string | null
  height: number
  width: number
}

export type FileSizeLimitationResize = {
  type: 'resize'
  limitBytes: number
  resizeWidth: number
}

export type FileSizeLimitationReject = {
  type: 'reject'
  limitBytes: number
}

export type FileSizeLimitationUnlimited = {
  type: 'unlimited'
}

export type HoliImagePickerFileSizeLimitation =
  | FileSizeLimitationUnlimited
  | FileSizeLimitationResize
  | FileSizeLimitationReject

export interface HoliImagePickerProps {
  buttonProps: Omit<HoliButtonProps, 'children' | 'onPress'>
  onPickImage?: (image: HoliImageInfo) => void
  onPickImages?: (images: HoliImageInfo[]) => void
  allowsMultipleSelection?: boolean
  fileSizeLimitation: HoliImagePickerFileSizeLimitation
}
