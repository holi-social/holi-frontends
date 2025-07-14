import type { StorybookConfig } from '@storybook/react-native'
import { stories } from 'holi-bricks/storybook/web/main'

const main: StorybookConfig = {
  stories,
  addons: [
    '@storybook/addon-ondevice-notes',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
  ],
}

export default main
