import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import type { StorybookConfig } from '@storybook/react-native'
import { stories } from 'holi-bricks/storybook/web/main'

const require = createRequire(import.meta.url)

function getAbsolutePath(value: string) {
  return dirname(require.resolve(join(value, 'package.json')))
}

const main: StorybookConfig = {
  stories,
  addons: [
    getAbsolutePath('@storybook/addon-ondevice-notes'),
    getAbsolutePath('@storybook/addon-ondevice-controls'),
    getAbsolutePath('@storybook/addon-ondevice-backgrounds'),
    getAbsolutePath('@storybook/addon-ondevice-actions'),
  ],
}

export default main
