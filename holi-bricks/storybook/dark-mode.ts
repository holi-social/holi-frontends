import { DocsTheme } from './docs-theme'
import { themes } from '@storybook/theming'
import { mono } from 'holi-bricks/tokens'

export const storybookDarkMode = {
  darkMode: {
    dark: { ...themes.dark, appBg: mono[800], appPreviewBg: mono[800], barBg: mono[800], appContentBg: mono[800] },
    light: { ...themes.normal, appBg: mono[200], appPreviewBg: mono[200], barBg: mono[200], appContentBg: mono[200] },
    current: 'light',
  },
  docs: {
    container: DocsTheme,
  },
}
