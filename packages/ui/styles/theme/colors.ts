import AsyncStorage from '@react-native-async-storage/async-storage'
import { ColorSchemeName, Platform } from 'react-native'

export const setColorScheme = async (value: ColorSchemeName) => {
  // mobile
  if (Platform.OS !== 'web') {
    try {
      if (value) {
        await AsyncStorage.setItem('theme', value)
      } else {
        await AsyncStorage.removeItem('theme')
      }
    } catch (error) {
      return
    }
  } else {
    // web
    if (value) {
      localStorage.setItem('theme', value)
      document.documentElement.setAttribute('data-theme', value)
    } else {
      localStorage.removeItem('theme')
      document.documentElement.removeAttribute('data-theme')
    }
  }
}

export const getColorScheme = async () => {
  let theme: string | undefined

  // mobile
  if (Platform.OS !== 'web') {
    try {
      theme = (await AsyncStorage.getItem('theme')) || undefined
    } catch (error) {
      // Error saving theme
    }
    return theme
  }

  // web
  theme = localStorage.getItem('theme') || undefined

  if (theme) {
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  } else {
    // TODO: add system theme once feature is stable
  }

  return theme || 'light'
}
