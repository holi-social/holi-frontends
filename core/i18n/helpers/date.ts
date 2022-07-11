import moment from 'moment'
import type { Moment } from 'moment'

import config from '@holi/core/i18n/config'

const date = {
  init: async (locale: string) => {
    await config.supportedLocales[locale].momentLocaleLoader()
    moment.locale(locale)
  },
  format: (date: Date | Moment, format?: string) => {
    return moment(date).format(format)
  },
}

export default date
