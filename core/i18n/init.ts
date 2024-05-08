import i18next, { TFunction } from 'i18next'

import { i18nConfig } from '@holi/core/i18n/config'
import { i18nModules } from '@holi/core/i18n/modules'

export const initI18n = async (): Promise<TFunction> => {
  i18nModules.forEach((module) => {
    i18next.use(module)
  })
  return await i18next.init(i18nConfig)
}
