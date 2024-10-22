import i18n, { initI18n } from '@holi/core/i18n'
import '@holi/storybook/storybook.css'
import '@holi/ui/assets/fonts/CircularStd/style.css'
import '@holi/ui/no-name/components/text/fonts/style.css'
import initialiseComponentLibrary from '@holi/ui/no-name/config/initialiseComponentLibrary'
import '@holi/web/styles/common.css'

import { withTheme } from './ThemeWrapper'

const awaitI18nInitialization = initI18n()

initialiseComponentLibrary()

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
