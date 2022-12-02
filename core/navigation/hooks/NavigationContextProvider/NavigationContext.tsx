import { createContext, useContext } from 'react'

import { NativeStackNavigationOptions } from '@react-navigation/native-stack'

export interface NavigationContextType {
  pathname: string
  setPathname: (pathName: string) => void
  options: NavigationCustomOptions
  setOptions: (options: NavigationCustomOptions) => void
}

export interface NavigationCustomOptions extends NativeStackNavigationOptions {
  navigationCustomOptions?: Partial<{
    headerBackgroundImageURI: string
    headerBackgroundGradient: boolean
    headerBackgroundCustom: React.ReactNode
    footerShown: boolean
  }>
}

export const NavigationContext = createContext<NavigationContextType>({
  pathname: '/',
  setPathname: () => null,
  options: {},
  setOptions: () => null,
})
NavigationContext.displayName = 'NavigationContext'

export const useNavigationContext = () => {
  const context = useContext(NavigationContext)

  if (context === undefined) throw new Error('useUnifiedNavigation() must be used within a NavigationContextProvider')

  return context
}

export const initialScreenOptions: NavigationCustomOptions = {
  title: undefined,
  header: undefined,
  headerBackVisible: undefined,
  headerBackTitle: undefined,
  headerBackTitleVisible: undefined,
  headerBackTitleStyle: undefined,
  headerBackImageSource: undefined,
  headerLargeStyle: undefined,
  headerLargeTitle: undefined,
  headerLargeTitleShadowVisible: undefined,
  headerLargeTitleStyle: undefined,
  headerShown: undefined,
  headerStyle: undefined,
  headerShadowVisible: undefined,
  headerTransparent: undefined,
  headerBlurEffect: undefined,
  headerTintColor: undefined,
  headerBackground: undefined,
  headerLeft: undefined,
  headerRight: undefined,
  headerTitle: undefined,
  headerTitleAlign: undefined,
  headerTitleStyle: undefined,
  headerSearchBarOptions: undefined,
  headerBackButtonMenuEnabled: undefined,
  autoHideHomeIndicator: undefined,
  navigationBarColor: undefined,
  navigationBarHidden: undefined,
  statusBarAnimation: undefined,
  statusBarColor: undefined,
  statusBarHidden: undefined,
  statusBarStyle: undefined,
  statusBarTranslucent: undefined,
  gestureDirection: undefined,
  contentStyle: undefined,
  customAnimationOnGesture: undefined,
  fullScreenGestureEnabled: undefined,
  gestureEnabled: undefined,
  animationTypeForReplace: undefined,
  animation: undefined,
  animationDuration: undefined,
  presentation: undefined,
  orientation: undefined,
  freezeOnBlur: undefined,
  navigationCustomOptions: {
    footerShown: true,
  },
}
