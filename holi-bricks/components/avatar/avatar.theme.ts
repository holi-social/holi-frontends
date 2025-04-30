import { blue, green, mono, purple } from 'holi-bricks/foundations'

const sharedColors = {
  bg: {
    blue: blue['400'],
    green: green['400'],
    purple: purple['400'],
  },
}

export const lightAvatarTheme = {
  text: mono[800],
  light: mono[100],
  strong: mono[800],
  ...sharedColors,
}

export const darkAvatarTheme = {
  text: mono[800],
  light: mono[700],
  strong: mono[100],
  ...sharedColors,
}
