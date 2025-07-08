import type { Preview } from '@storybook/react'
import { initializeBricks } from 'holi-bricks/styles/init'
import { storybookThemeConfig, withThemeReactNative } from 'holi-bricks/storybook/theme-switcher'
import { withPadding } from 'holi-bricks/storybook/mobile/decorators'

initializeBricks()

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
  decorators: [withThemeReactNative, withPadding],
}

export default preview
