import type { Preview } from '@storybook/react'
import 'holi-bricks/libs/init'
import { withTheme } from 'holi-bricks/storybook/theme-switcher'
import { storybookDarkMode } from './dark-mode'
import { storybookThemeConfig } from 'holi-bricks/storybook/theme-config'

const preview: Preview = {
  parameters: {
    ...storybookDarkMode,
  },
  globalTypes: {
    ...storybookThemeConfig,
  },
  tags: ['autodocs'],
  decorators: [withTheme],
}

export default preview
