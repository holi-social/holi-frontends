import { NextPageContext } from 'next'
import { Ni18nServerState, loadTranslations } from 'ni18n'

import { ni18nConfig } from '@holi/web/helpers/ni18nConfig'
import { NextJSPageProps } from '@holi/web/types'

import { detectLanguagesFromHeader } from './detectLanguagesFromHeader'

export interface I18nProps extends Ni18nServerState {
  locale?: string
}

export const addTranslations = async (req: NextPageContext['req'], props: Partial<NextJSPageProps>) => {
  const languages = detectLanguagesFromHeader(req)
  const locale = languages?.find((lng) => ni18nConfig.supportedLngs.includes(lng)) || ni18nConfig.fallbackLng
  const translations = await loadTranslations(ni18nConfig, locale, ni18nConfig.ns)

  return {
    ...props,
    ...translations,
    locale,
  }
}
