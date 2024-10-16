import { black, blue, byShade, mono, white } from '@holi/ui/no-name/foundations/colors/primitives'

const theme = {
  colors: {
    text: mono[100],
    background: mono[700],
    focus: `${mono[700]} 0px 0px 0px 1.5px, ${blue[600]} 0px 0px 0px 3px`,
  },
  components: {
    chipSelect: {
      text: mono[200],
      border: mono[200],
      background: mono[700],
      selected: {
        background: {
          ...byShade('700'),
        },
      },
    },
    chipAction: {
      text: mono[300],
      border: mono[300],
      background: {
        ...byShade('700'),
        white: black,
      },
      selected: {
        text: black,
        border: white,
        background: white,
      },
    },
    chipLabel: {
      text: mono[300],
      border: {
        ...byShade('700'),
        mono: mono[500],
        white: mono[500],
      },
      background: {
        ...byShade('800'),
        mono: mono[700],
        white: black,
      },
    },
    selector: {
      backgroundColor: mono[700],
      outlineColor: mono[500],
      selected: {
        outlineColor: mono[200],
      },
      text: mono[200],
    },
  },
} as const

export default theme
