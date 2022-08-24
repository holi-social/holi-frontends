import * as NextImage from 'next/image'
import * as React from 'react'

import i18n, { initI18n } from '@holi/core/i18n'
import '@holi/ui/assets/fonts/CircularStd/style.css'
import '@holi/web/styles/common.css'
import '@holi/storybook/storybook.css'

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

// de-optimize next Image component asset loading
const OriginalNextImage = NextImage.default

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props) => <OriginalNextImage {...props} unoptimized />,
})
