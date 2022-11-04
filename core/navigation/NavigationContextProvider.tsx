import React, { ReactElement, createContext, useCallback, useContext, useState } from 'react'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { NativeStackNavigationCustomHeaderOptions } from '@holi/mobile/navigation/HeaderAnimated'

export type linkDirection = 'left' | 'down'
export type NavigationContextType = {
  pathname: string
  setPathname: (path: string) => void
  headerTitle: string
  setHeaderTitle: (title: string) => void
  showBackLink: boolean
  showDownLink: boolean
  clearBackLinks: () => void
  titleElement?: ReactElement
  setTitleElement: (node?: ReactElement) => void
  headerLeft?: ReactElement
  setHeaderLeft: (node?: ReactElement) => void
  headerRight?: ReactElement
  setHeaderRight: (node?: ReactElement) => void
}

const NavigationContext = createContext<NavigationContextType>({
  pathname: '/',
  setPathname: () => null,
  headerTitle: '',
  setHeaderTitle: () => null,
  showBackLink: false,
  showDownLink: false,
  clearBackLinks: () => null,
  setTitleElement: () => null,
  setHeaderLeft: () => null,
  setHeaderRight: () => null,
})
NavigationContext.displayName = 'NavigationContext'

export const useNavigationContext = () => useContext(NavigationContext)

const NavigationContextProvider: React.FC = ({ children }) => {
  const [pathname, setPathname] = useState('/')
  const [headerTitle, setHeaderTitle] = useState('')
  const [showBackLink, setShowBackLink] = useState(false)
  const [showDownLink, setShowDownLink] = useState(false)
  const [titleElement, setTitleElement] = useState<ReactElement>()
  const [headerLeft, setHeaderLeft] = useState<ReactElement>()
  const [headerRight, setHeaderRight] = useState<ReactElement>()

  const clearBackLinks = useCallback(() => {
    setShowBackLink(false)
    setShowDownLink(false)
    setHeaderTitle('')
    setTitleElement(undefined)
    setHeaderLeft(undefined)
    setHeaderRight(undefined)
  }, [])

  return (
    <NavigationContext.Provider
      value={{
        pathname,
        setPathname,
        headerTitle,
        setHeaderTitle,
        showBackLink,
        showDownLink,
        clearBackLinks,
        titleElement,
        setTitleElement,
        headerLeft,
        setHeaderLeft,
        headerRight,
        setHeaderRight,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

interface NewNavigationContextType {
  pathname: string
  setPathname: (pathName: string) => void
  options: NativeStackNavigationCustomHeaderOptions
  setOptions: (options: NativeStackNavigationCustomHeaderOptions) => void
}

const NewNavigationContext = createContext<NewNavigationContextType>({
  pathname: '/',
  setPathname: () => null,
  options: {},
  setOptions: () => null,
})
NavigationContext.displayName = 'NavigationContext'

const initialScreenOptions: NativeStackNavigationCustomHeaderOptions = {
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
}

const NewNavigationContextProvider: React.FC = ({ children }) => {
  const [pathname, setPathname] = useState('/')
  const [options, setScreenOptions] = useState(initialScreenOptions)

  const setOptions = useCallback(
    (newHeaderOptions: NativeStackNavigationCustomHeaderOptions) =>
      setScreenOptions(() => ({ ...initialScreenOptions, ...newHeaderOptions })),
    []
  )

  return (
    <NewNavigationContext.Provider
      value={{
        pathname,
        setPathname,
        options,
        setOptions,
      }}
    >
      {children}
    </NewNavigationContext.Provider>
  )
}

export const useUnifiedNavigation = () => {
  const context = useContext(NewNavigationContext)
  const { navigate, navigateBack, replaceRoute, query } = useRouting()

  if (context === undefined)
    throw new Error('useUnifiedNavigation() must be used within a NewNavigationContextProvider')

  return {
    navigate,
    navigateBack,
    replaceRoute,
    query,
    ...context,
  }
}

export default NavigationContextProvider
