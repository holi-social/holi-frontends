import { black, byShade, mono, white, yellow } from 'holi-bricks/foundations'

export const darkChipTheme = {
  chipSelect: {
    text: mono[200],
    border: mono[200],
    background: mono[700],
    selected: {
      background: {
        ...byShade('700'),
        yellowLight: yellow[800],
      },
    },
    backgroundCounter: mono[600],
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
}

export const lightChipTheme = {
  chipSelect: {
    text: black,
    border: black,
    background: white,
    selected: {
      background: {
        ...byShade('400'),
        yellowLight: yellow[300],
      },
    },
    backgroundCounter: mono[300],
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
}
