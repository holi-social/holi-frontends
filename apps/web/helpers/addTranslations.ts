import { Ni18nServerState, loadTranslations } from 'ni18n'

import { ni18nConfig } from '@holi/web/helpers/ni18nConfig'
import { NextJSPageProps } from '@holi/web/types'

export interface I18nProps extends Ni18nServerState {
  locale?: string
}

export const addTranslations = async (locale: string = ni18nConfig.fallbackLng, props: Partial<NextJSPageProps>) => {
  const translations = await loadTranslations(ni18nConfig, locale, ni18nConfig.ns)

  return {
    ...props,
    ...translations,
    locale,
  }
}
