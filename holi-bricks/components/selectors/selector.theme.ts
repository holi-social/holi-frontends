import { mono } from 'holi-bricks/foundations'

export const darkSelectorTheme = {
  backgroundColor: mono[700],
  outlineColor: mono[500],
  selected: {
    outlineColor: mono[200],
  },
  text: mono[300],
}

export const lightSelectorTheme = {
  backgroundColor: mono[100],
  outlineColor: mono[400],
  selected: {
    outlineColor: mono[800],
  },
  text: mono[600],
}
