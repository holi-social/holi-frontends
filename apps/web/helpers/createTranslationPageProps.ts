import { loadTranslations } from 'ni18n'

import { ni18nConfig } from '@holi/web/helpers/ni18nConfig'

export const createTranslationPageProps = async (locale: string) => {
  const translations = await loadTranslations(ni18nConfig, locale, ni18nConfig.ns)

  return translations
}
