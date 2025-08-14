import { i18nConfig } from '@holi/core/i18n/config'
import { i18nModules } from '@holi/core/i18n/modules'

export const nextJsDefaultLocale = 'default'

export const ni18nConfig = {
  ...i18nConfig,
  use: i18nModules,
}
