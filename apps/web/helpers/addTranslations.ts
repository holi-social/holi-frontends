import { Ni18nServerState, loadTranslations } from 'ni18n'

import { ni18nConfig } from '@holi/web/helpers/ni18nConfig'
import { NextJSPageProps } from '@holi/web/types'

export type I18nProps = Ni18nServerState

export const addTranslations = async (locale: string | undefined, props: Partial<NextJSPageProps>) => {
  const translations = await loadTranslations(ni18nConfig, locale || ni18nConfig.fallbackLng, ni18nConfig.ns)

  return {
    ...props,
    ...translations,
  }
}
