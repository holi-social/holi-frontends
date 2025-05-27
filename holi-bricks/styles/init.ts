import { breakpoints } from 'holi-bricks/foundations'
import { darkTheme } from 'holi-bricks/foundations/colors/themes/dark'
import { lightTheme } from 'holi-bricks/foundations/colors/themes/light'
import { StyleSheet } from 'react-native-unistyles'

StyleSheet.configure({
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  breakpoints,
})
