import { lightAvatarTheme } from 'holi-bricks/components/avatar/avatar.theme'
import { lightButtonTheme } from 'holi-bricks/components/button/button.theme'
import { lightChipTheme } from 'holi-bricks/components/chips/chip.theme'
import { lightSelectorTheme } from 'holi-bricks/components/selectors/selector.theme'
import { blue, green, mono, orange, purple, red, yellow } from 'holi-bricks/tokens'

export const lightTheme = {
  colors: {
    focus: `${mono[200]} 0px 0px 0px 1.5px, ${blue[400]} 0px 0px 0px 3px`,
    bg: {
      container: mono[100],
      page: mono[200],
      selected: mono[800],
      disabled: mono[400],
    },
    fill: {
      main: mono[800],
      support: mono[600],
      default: mono[500],
      disabled: mono[400],
      informative: purple[600],
      positive: green[700],
      warning: orange[600],
      danger: red[600],
    },
    border: {
      main: mono[800],
      support: mono[400],
      default: mono[300],
      quaternary: mono[200],
    },
    decorative: {
      black: mono[800],
      white: mono[100],
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
    button: lightButtonTheme,
    chipAction: lightChipTheme.chipAction,
    chipLabel: lightChipTheme.chipLabel,
    chipSelect: lightChipTheme.chipSelect,
    selector: lightSelectorTheme,
    avatar: lightAvatarTheme,
  },
}
