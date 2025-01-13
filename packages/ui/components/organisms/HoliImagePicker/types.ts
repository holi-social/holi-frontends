import type { ReactNativeFile } from '@holi/api/graphql/client'
import type { ButtonProps, ButtonIconProps } from 'holi-bricks/components/button'
import type { ViewStyle } from 'react-native'
import type { StyleProp } from 'react-native'

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
  children?: React.ReactNode
  buttonProps?: Omit<ButtonProps, 'onPress'> & { style?: StyleProp<ViewStyle> }
  buttonIconProps?: Omit<ButtonIconProps, 'onPress'>
  onPickImage?: (image: HoliImageInfo) => void
  onPickImages?: (images: HoliImageInfo[]) => void
  allowsMultipleSelection?: boolean
  fileSizeLimitation: HoliImagePickerFileSizeLimitation
  buttonIconOnly?: boolean
}
