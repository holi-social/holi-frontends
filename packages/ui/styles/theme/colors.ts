import { ColorSchemeName, Platform } from 'react-native'

export const setColorScheme = (value: ColorSchemeName) => {
  // console.log('setting color scheme', value)
  if (Platform.OS !== 'web') return

  if (value) {
    localStorage.setItem('theme', value)
    document.documentElement.setAttribute('data-theme', value)
  }

  // auto theme (system settings)
  if (!value) {
    localStorage.removeItem('theme')
    document.documentElement.removeAttribute('data-theme')
  }
}

export const useColorScheme = () => {
  // console.log(Platform.OS)
  if (Platform.OS !== 'web') return 'light' // TODO: get from asyncStorage for mobile

  const theme = localStorage.getItem('theme')

  if (theme) {
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  } else {
    // TODO: add system theme once feature is stable
  }

  return theme || 'light'
}
