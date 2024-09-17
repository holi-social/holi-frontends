import { UnistylesRegistry } from 'react-native-unistyles'

import darkTheme from '@holi/ui/no-name/foundations/colors/themes/dark'
import lightTheme from '@holi/ui/no-name/foundations/colors/themes/light'
import breakpoints from '@holi/ui/no-name/foundations/dimensions/breakpoints'

const initialiseComponentLibrary = () =>
  UnistylesRegistry.addBreakpoints({ ...{ zero: 0 }, ...breakpoints })
    .addThemes({
      light: lightTheme,
      dark: darkTheme,
    })
    .addConfig({
      initialTheme: 'light',
    })

export default initialiseComponentLibrary
