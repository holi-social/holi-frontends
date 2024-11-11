import { lightAvatarTheme } from 'holi-bricks/components/avatar/avatar.theme'
import { lightButtonTheme } from 'holi-bricks/components/button/button.theme'
import { lightChipTheme } from 'holi-bricks/components/chips/chip.theme'
import { lightSelectorTheme } from 'holi-bricks/components/selectors/selector.theme'
import { lightTextTheme } from 'holi-bricks/components/text/text.theme'
import { blue, mono } from 'holi-bricks/tokens'

export const lightTheme = {
  colors: {
    background: mono[200],
    focus: `${mono[200]} 0px 0px 0px 1.5px, ${blue[400]} 0px 0px 0px 3px`,
  },
  components: {
    text: lightTextTheme,
    button: lightButtonTheme,
    chipAction: lightChipTheme.chipAction,
    chipLabel: lightChipTheme.chipLabel,
    chipSelect: lightChipTheme.chipSelect,
    selector: lightSelectorTheme,
    avatar: lightAvatarTheme,
  },
}
