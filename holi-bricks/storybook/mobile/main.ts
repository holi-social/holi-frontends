import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import type { StorybookConfig } from '@storybook/react-native'
// eslint-disable-next-line no-restricted-imports
import { stories } from '../stories.ts'

function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
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
