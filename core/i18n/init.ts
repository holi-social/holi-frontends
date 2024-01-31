import i18next, { TFunction } from 'i18next'

import { i18nConfig, i18nModules } from '@holi/core/i18n'

export const initI18n = async (): Promise<TFunction> => {
  i18nModules.forEach((module) => {
    i18next.use(module)
  })
  return await i18next.init(i18nConfig)
}
