import type { Preview } from '@storybook/react'
import 'holi-bricks/libs/init'
import { storybookThemeConfig, withThemeReactNative } from 'holi-bricks/storybook/theme-switcher'

const preview: Preview = {
  parameters: {},
  argTypes: {
    theme: {
      options: ['light', 'dark'],
      control: { type: 'radio' },
    },
  },
  args: {
    theme: 'light',
  },
  globalTypes: {
    ...storybookThemeConfig,
  },
  decorators: [withThemeReactNative],
}

export default preview
