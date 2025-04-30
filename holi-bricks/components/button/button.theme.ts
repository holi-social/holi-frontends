import { mono, red, yellow } from 'holi-bricks/foundations'

export const darkButtonTheme = {
  primary: {
    background: yellow[700],
    border: yellow[600],
    text: yellow[300],
  },
  secondary: {
    background: mono[700],
    border: mono[200],
    text: mono[100],
  },
  tertiary: {
    background: 'none',
    border: mono[600],
    text: mono[100],
  },
  selected: {
    background: mono[700],
    border: mono[400],
    text: mono[100],
  },
  disabled: {
    background: mono[700],
    border: mono[600],
    text: mono[500],
  },
  danger: {
    background: red[800],
    border: red[400],
    text: red[300],
  },
}

export const lightButtonTheme = {
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
  tertiary: {
    background: 'none',
    border: mono[200],
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
}
