import { darkAvatarTheme } from 'holi-bricks/components/avatar/avatar.theme'
import { darkButtonTheme } from 'holi-bricks/components/button/button.theme'
import { darkChipTheme } from 'holi-bricks/components/chips/chip.theme'
import { darkSelectorTheme } from 'holi-bricks/components/selectors/selector.theme'
import { blue, green, yellow, purple, mono, orange, red } from 'holi-bricks/tokens'

export const darkTheme = {
  colors: {
    focus: `${mono[700]} 0px 0px 0px 1.5px, ${blue[600]} 0px 0px 0px 3px`,
    bg: {
      container: mono[700],
      page: mono[800],
      selected: mono[100],
      disabled: mono[600],
    },
    fill: {
      main: mono[200],
      support: mono[300],
      default: mono[400],
      disabled: mono[500],
      informative: purple[400],
      positive: green[600],
      warning: orange[400],
      danger: red[400],
    },
    border: {
      main: mono[200],
      support: mono[500],
      default: mono[600],
      quaternary: mono[700],
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
