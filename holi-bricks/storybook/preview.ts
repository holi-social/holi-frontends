import type { Preview } from '@storybook/react'
import 'holi-bricks/components/text/fonts/style.css'
import { storybookThemeConfig, withTheme } from 'holi-bricks/storybook/theme-switcher'
import 'holi-bricks/styles/init'

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

  decorators: [withTheme],
}

export default preview
