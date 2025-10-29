import { SetContextLink } from '@apollo/client/link/context'

import i18n, { i18nConfig } from '@holi/core/i18n'

const createLocaleHeaderLink = (locale?: string) =>
  new SetContextLink(({ headers }) => {
    return {
      headers: {
        ...headers,
        // On web locale is determine by Next.JS (via url path parameter),
        // on mobile locale is set globally in i18n.language
        'Accept-Language': [locale || i18n.language, i18nConfig.fallbackLng].join(','),
      },
    }
  })

export default createLocaleHeaderLink
