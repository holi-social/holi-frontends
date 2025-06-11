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
  component: JSX.Element
}

export type HeaderBackgroundOptions = BackgroundImageURI | BackgroundGradient | BackgroundCustom

/**
 * Extended options for Holi navigation styling.
 * `navigationCustomOptions` is NOT supported dynamically in Expo Router.
 * Use it inside `useNavigationOptions` or layout wrappers.
 */
export interface NavigationCustomOptions extends NativeStackNavigationOptions {
  navigationCustomOptions?: {
    /**
     * Custom background (image/gradient/component).
     * Must be handled in layout or screen manually.
     */
    background?: HeaderBackgroundOptions

    /**
     * Whether to show the custom footer.
     * Must be consumed manually inside a layout.
     */
    footerShown?: boolean
  }
}
