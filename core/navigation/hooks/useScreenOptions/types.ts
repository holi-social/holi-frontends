import { NativeStackNavigationOptions } from '@react-navigation/native-stack'

export interface BackgroundImageURI {
  type: 'image'
  uri: string
}
export interface BackgroundGradient {
  type: 'gradient'
  colors?: string[]
}
export interface BackgroundCustom {
  type: 'custom'
  component: React.ReactElement
}

export type HeaderBackgroundOptions = BackgroundImageURI | BackgroundGradient | BackgroundCustom

export interface NavigationCustomOptions extends NativeStackNavigationOptions {
  navigationCustomOptions?: {
    background?: HeaderBackgroundOptions
    footerShown?: boolean
  }
}
