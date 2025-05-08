import { breakpoints } from 'holi-bricks/foundations'
import { darkTheme } from 'holi-bricks/foundations/colors/themes/dark'
import { lightTheme } from 'holi-bricks/foundations/colors/themes/light'
import { UnistylesRegistry } from 'react-native-unistyles'

// @ts-ignore
UnistylesRegistry.addBreakpoints({ ...{ zero: 0 }, ...breakpoints })
  .addThemes({
    light: lightTheme,
    dark: darkTheme,
  })
  .addConfig({
    initialTheme: 'light',
  })
