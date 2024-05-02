import { NextPageContext } from 'next'
import { Ni18nServerState, loadTranslations } from 'ni18n'

import { detectLocaleFromHeader } from '@holi/web/helpers/detectLocaleFromHeader'
import { ni18nConfig } from '@holi/web/helpers/ni18nConfig'
import { NextJSPageProps } from '@holi/web/types'

export interface I18nProps extends Ni18nServerState {
  locale?: string
}

export const addTranslations = async (req: NextPageContext['req'], props: Partial<NextJSPageProps>) => {
  const locale = detectLocaleFromHeader(req)
  const translations = await loadTranslations(ni18nConfig, locale, ni18nConfig.ns)

  return {
    ...props,
    ...translations,
    locale,
  }
}
