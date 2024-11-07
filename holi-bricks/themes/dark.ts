import { darkButtonTheme } from 'holi-bricks/components/button/button.theme'
import { darkChipTheme } from 'holi-bricks/components/chips/chip.theme'
import { darkSelectorTheme } from 'holi-bricks/components/selectors/selector.theme'
import { darkTextTheme } from 'holi-bricks/components/text/text.theme'
import { blue, mono } from 'holi-bricks/tokens'

export const darkTheme = {
  colors: {
    background: mono[700],
    focus: `${mono[700]} 0px 0px 0px 1.5px, ${blue[600]} 0px 0px 0px 3px`,
  },
  components: {
    text: darkTextTheme,
    button: darkButtonTheme,
    chipAction: darkChipTheme.chipAction,
    chipLabel: darkChipTheme.chipLabel,
    chipSelect: darkChipTheme.chipSelect,
    selector: darkSelectorTheme,
  },
}
