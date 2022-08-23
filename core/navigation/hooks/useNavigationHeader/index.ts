import { ReactNode } from 'react'
import { NativeStackNavigationOptions } from 'react-native-screens/native-stack'

export interface HeaderProps extends NativeStackNavigationOptions {
  title?: string
  titleElement?: (props: { tintColor?: string; pressColor?: string; pressOpacity?: number }) => ReactNode
  headerLeft?: (props: { tintColor?: string; pressColor?: string; pressOpacity?: number }) => ReactNode
  headerRight?: (props: { tintColor?: string; pressColor?: string; pressOpacity?: number }) => ReactNode
}

export { default } from './useNavigationHeader'
