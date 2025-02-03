import { darkTheme } from 'holi-bricks/foundations/colors/themes/dark'
import { lightTheme } from 'holi-bricks/foundations/colors/themes/light'
import { breakpoints } from 'holi-bricks/tokens'
import { UnistylesRegistry } from 'react-native-unistyles'

UnistylesRegistry.addBreakpoints({ ...{ zero: 0 }, ...breakpoints })
  .addThemes({
    light: lightTheme,
    dark: darkTheme,
  })
  .addConfig({
    initialTheme: 'light',
  })
