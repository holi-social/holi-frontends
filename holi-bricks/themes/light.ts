import { black, blue, mono, white } from 'holi-bricks/tokens'
import { byShade } from 'holi-bricks/utils/byShade'

export const lightTheme = {
  colors: {
    text: black,
    background: mono[200],
    focus: `${mono[200]} 0px 0px 0px 1.5px, ${blue[400]} 0px 0px 0px 3px`,
  },
  components: {
    chipSelect: {
      text: black,
      border: black,
      background: white,
      selected: {
        background: {
          ...byShade('400'),
        },
      },
    },
    chipAction: {
      text: black,
      border: black,
      background: {
        ...byShade('400'),
        mono: mono[200],
        white,
      },
      selected: {
        text: white,
        border: black,
        background: black,
      },
    },
    chipLabel: {
      text: black,
      border: {
        ...byShade('400'),
        mono: mono[300],
        white: mono[300],
      },
      background: {
        ...byShade('300'),
        mono: mono[200],
        white,
      },
    },
  },
}
