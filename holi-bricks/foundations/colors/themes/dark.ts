import { darkAvatarTheme } from 'holi-bricks/components/avatar/avatar.theme'
import { darkButtonTheme } from 'holi-bricks/components/button/button.theme'
import { darkChipTheme } from 'holi-bricks/components/chips/chip.theme'
import { darkSelectorTheme } from 'holi-bricks/components/selectors/selector.theme'
import { blue, green, mono, orange, purple, red, transparent, yellow } from 'holi-bricks/foundations'

export const darkTheme = {
  shadows: {
    200: {
      shadowColor: 'rgba(255, 255, 255, 0.08)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 2,
      boxShadow: '0px 2px 0px rgba(255, 255, 255, 0.08)',
    },
  },
  colors: {
    focus: `${mono[700]} 0px 0px 0px 1.5px, ${blue[600]} 0px 0px 0px 3px`,
    bg: {
      support: mono[700],
      main: mono[800],
      selected: mono[100],
      muted: mono[600],
      overlay: transparent.mono100.at8,
    },
    fill: {
      main: mono[200],
      support: mono[300],
      default: mono[400],
      muted: mono[500],
      selected: mono[800],
      informative: purple[400],
      positive: green[600],
      warning: orange[400],
      danger: red[400],
    },
    border: {
      main: mono[200],
      support: mono[500],
      default: mono[600],
      muted: mono[700],
    },
    decorative: {
      black: mono[800],
      white: mono[100],
      greyLight: mono[300],
      greyDark: mono[600],
      yellowLight: yellow[300],
      yellowDefault: yellow[400],
      yellowDark: yellow[600],
      purpleLight: purple[300],
      purpleDefault: purple[400],
      purpleDark: purple[600],
      greenLight: green[300],
      greenDefault: green[400],
      greenDark: green[600],
      blueLight: blue[300],
      blueDefault: blue[400],
      blueDark: blue[600],
      orangeLight: orange[300],
      orangeDefault: orange[400],
      orangeDark: orange[600],
      redLight: red[300],
      redDefault: red[400],
      redDark: red[600],
    },
  },
  components: {
    button: darkButtonTheme,
    chipAction: darkChipTheme.chipAction,
    chipLabel: darkChipTheme.chipLabel,
    chipSelect: darkChipTheme.chipSelect,
    selector: darkSelectorTheme,
    avatar: darkAvatarTheme,
  },
}
