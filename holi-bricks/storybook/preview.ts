import type { Preview } from '@storybook/react'
import 'holi-bricks/libs/init'
import { withTheme } from 'holi-bricks/storybook/theme-switcher'
import { storybookDarkMode } from './dark-mode'

const preview: Preview = {
  parameters: {
    ...storybookDarkMode,
  },
  decorators: [withTheme],
}

export default preview
