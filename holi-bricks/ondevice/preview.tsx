import type { Preview } from '@storybook/react'
import 'holi-bricks/libs/init'
import { withThemeReactNative } from 'holi-bricks/ondevice/theme-switcher'
import { storybookThemeConfig } from 'holi-bricks/ondevice/theme-config'

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
