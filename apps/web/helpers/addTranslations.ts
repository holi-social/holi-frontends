import { loadTranslations } from 'ni18n'

import { getValidLocale } from '@holi/web/helpers/getValidLocale'
import { ni18nConfig } from '@holi/web/helpers/ni18nConfig'
import { NextJSPageProps } from '@holi/web/types'

export const addTranslations = async (nextJslocale: string | undefined, props: Partial<NextJSPageProps>) => {
  const locale = getValidLocale(nextJslocale)
  const translations = await loadTranslations(ni18nConfig, locale, ni18nConfig.ns)

  return {
    ...props,
    ...translations,
    locale,
  }
}
