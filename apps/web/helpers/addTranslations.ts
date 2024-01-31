import { loadTranslations } from 'ni18n'

import { ni18nConfig } from '@holi/web/helpers/ni18nConfig'

export interface I18nProps {
  locale?: string
}

export const addTranslations = async <P extends I18nProps>(locale: string, props: P) => {
  const translations = await loadTranslations(ni18nConfig, locale, ni18nConfig.ns)

  // TODO(SF) override locale?
  return {
    ...props,
    ...translations,
  }
}
