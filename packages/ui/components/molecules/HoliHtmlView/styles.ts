/**
 * See docu: https://meliorence.github.io/react-native-render-html/docs/guides/styling
 **/
import { StyleSheet } from 'react-native'

import { HoliTheme } from '@holi/ui/styles/theme'

const styles = (theme: HoliTheme) =>
  StyleSheet.create({
    body: {
      color: theme.colors.foreground30,
      fontWeight: '400',
      fontFamily: theme.fontFamily.default('Regular'),
    },
    h1: {
      marginBottom: 20,
      fontWeight: '500',
      fontFamily: theme.fontFamily.default('Medium'),
    },
    h2: {
      marginBottom: 20,
    },
    a: {
      color: theme.colors.brandColorB30,
    },
    p: {
      padding: 0,
      margin: 0,
      marginBottom: 20,
    },
    ul: {
      margin: 0,
      paddingLeft: 24,
    },
    li: {
      paddingLeft: 6,
    },
    strong: {
      fontWeight: '500',
      fontFamily: theme.fontFamily.default('Medium'),
    },
  })

export default styles
