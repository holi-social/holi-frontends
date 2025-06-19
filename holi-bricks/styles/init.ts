import { breakpoints } from 'holi-bricks/foundations'
import { lightTheme } from 'holi-bricks/foundations/colors/themes/light'
import { UnistylesRegistry } from 'react-native-unistyles'

// @ts-ignore
UnistylesRegistry.addBreakpoints({ ...{ zero: 0 }, ...breakpoints })
  .addThemes({
    light: lightTheme,
    // Removing dark theme until fully supported with HOLI-11770
    // dark: darkTheme,
  })
  .addConfig({
    initialTheme: 'light',
  })
