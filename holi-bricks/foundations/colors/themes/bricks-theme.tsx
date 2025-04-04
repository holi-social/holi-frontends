import { useBricks } from './useBricks'
import { useEffect } from 'react'
import { AppState, type AppStateStatus } from 'react-native'

export const BricksTheme = ({
  children,
  initialTheme = 'light',
}: React.PropsWithChildren<{ initialTheme?: AvailableThemes }>) => {
  const { setActiveTheme } = useBricks()

  useEffect(() => {
    setActiveTheme(initialTheme)
  }, [initialTheme, setActiveTheme])

  // Workaround for issue in unistyles losing the theme
  // https://github.com/jpudysz/react-native-unistyles/issues/327
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        setActiveTheme(initialTheme)
      }
    }
    const appStateListener = AppState.addEventListener('change', handleAppStateChange)

    return () => {
      appStateListener.remove()
    }
  }, [initialTheme, setActiveTheme])

  return children
}
