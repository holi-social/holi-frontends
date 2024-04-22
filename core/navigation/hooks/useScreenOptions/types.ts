import { NativeStackNavigationOptions } from '@react-navigation/native-stack'

export interface NavigationCustomOptions extends NativeStackNavigationOptions {
  navigationCustomOptions?: Partial<{
    headerBackgroundImageURI: string
    headerBackgroundGradient: boolean
    headerBackgroundCustom: React.ReactNode
    footerShown: boolean
    seoTitle: string
  }>
}
