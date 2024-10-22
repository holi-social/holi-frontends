import type { Preview } from '@storybook/react'
import 'holi-bricks/libs/init'
import { storybookThemeConfig, withTheme } from 'holi-bricks/storybook/theme-switcher'

const preview: Preview = {
  parameters: {
    // actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {},
    },
  },
  globalTypes: {
    ...storybookThemeConfig,
  },
  tags: ['autodocs'],
  decorators: [withTheme],
}

export default preview
