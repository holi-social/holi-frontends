import { black, blue, byShade, mono, white } from '@holi/ui/no-name/foundations/colors/primitives'

const theme = {
  colors: {
    text: black,
    background: mono[200],
    focus: `${mono[200]} 0px 0px 0px 1.5px, ${blue[400]} 0px 0px 0px 3px`,
  },
  components: {
    chip: {
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
  },
} as const

export default theme
