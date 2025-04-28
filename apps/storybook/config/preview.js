import 'holi-bricks/components/text/fonts/style.css'
import 'holi-bricks/styles/init'

import i18n, { initI18n } from '@holi/core/i18n'
import '@holi/storybook/storybook.css'
import '@holi/web/styles/common.css'

import { withTheme } from './ThemeWrapper'

const awaitI18nInitialization = initI18n()

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  i18n,
  locale: 'en',
  locales: {
    en: { title: 'English', left: '🇬🇧' },
    de: { title: 'Deutsch', left: '🇩🇪' },
  },
}

export const loaders = [async () => await awaitI18nInitialization]

export const globalTypes = {
  theme: {
    name: 'Theme',
    defaultValue: 'light',
    toolbar: {
      icon: 'mirror',
      items: ['light', 'dark', 'both'],
      dynamicTitle: true,
    },
  },
}

const preview = {
  decorators: [withTheme],
}

export default preview
