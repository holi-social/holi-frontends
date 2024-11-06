import { lightButtonTheme } from 'holi-bricks/components/button/button.theme'
import { lightChipTheme } from 'holi-bricks/components/chips/chip.theme'
import { lightSelectorTheme } from 'holi-bricks/components/selectors/selector.theme'
import { black, blue, mono } from 'holi-bricks/tokens'

export const lightTheme = {
  colors: {
    text: black,
    textSecondary: mono[600],
    textTertiary: mono[500],
    background: mono[200],
    focus: `${mono[200]} 0px 0px 0px 1.5px, ${blue[400]} 0px 0px 0px 3px`,
  },
  components: {
    button: lightButtonTheme,
    chipAction: lightChipTheme.chipAction,
    chipLabel: lightChipTheme.chipLabel,
    chipSelect: lightChipTheme.chipSelect,
    selector: lightSelectorTheme,
  },
}
