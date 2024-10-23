import { black, blue, byShade, mono, red, white, yellow } from '@holi/ui/no-name/foundations/colors/primitives'

const theme = {
  colors: {
    text: black,
    background: mono[200],
    focus: `${mono[200]} 0px 0px 0px 1.5px, ${blue[400]} 0px 0px 0px 3px`,
  },
  components: {
    button: {
      primary: {
        background: yellow[400],
        border: mono[800],
        text: mono[800],
      },
      secondary: {
        background: mono[100],
        border: mono[800],
        text: mono[800],
      },
      selected: {
        background: mono[100],
        border: mono[400],
        text: mono[800],
      },
      disabled: {
        background: mono[100],
        border: mono[300],
        text: mono[400],
      },
      danger: {
        background: red[300],
        border: red[600],
        text: red[600],
      },
    },
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
    selector: {
      backgroundColor: mono[100],
      outlineColor: mono[400],
      selected: {
        outlineColor: mono[800],
      },
      text: mono[800],
    },
  },
} as const

export default theme
