import { makeVar, useReactiveVar } from '@apollo/client'
import { Appearance, ColorSchemeName } from 'react-native'

export const colorScheme = makeVar<ColorSchemeName>(Appearance.getColorScheme())

export const setColorScheme = (value: ColorSchemeName) => {
  colorScheme(value)
}

export const useColorScheme = () => {
  return useReactiveVar(colorScheme)
}
const scheme = colorScheme()
console.log(scheme)
