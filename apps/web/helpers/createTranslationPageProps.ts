import { loadTranslations } from 'ni18n'

import { getValidLocale } from '@holi/web/helpers/getValidLocale'
import { ni18nConfig } from '@holi/web/helpers/ni18nConfig'

export const createTranslationPageProps = async (nextJslocale: string | undefined) => {
  const locale = getValidLocale(nextJslocale)
  const translations = await loadTranslations(ni18nConfig, locale, ni18nConfig.ns)

  return {
    ...translations,
    locale,
  }
}
