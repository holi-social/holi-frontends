import { StyleSheet } from 'react-native'

import { styleVars } from '@holi/ui/styles/globalVars'
import { HoliTheme } from '@holi/ui/styles/theme/theme'

const getMixins = (theme: HoliTheme, screenWidth: number) =>
  StyleSheet.create({
    container: {
      alignSelf: 'center',
      width: '100%',
      maxWidth: styleVars.vars.maxScreenWidth,
      paddingHorizontal: screenWidth > theme.vars.breakpointXl ? 0 : 20,
    },
  })

export { getMixins }
