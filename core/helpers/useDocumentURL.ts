import { useTranslation } from 'react-i18next'

import { holiNextJSApiUrl } from '@holi/api/config'
import type { DocType } from '@holi/web/pages/api/documents/index'

export const useDocumentURL = (docType?: DocType): string | undefined => {
  const { i18n } = useTranslation()

  if (!docType) {
    return
  }

  // create absolute path for mobile
  const url = new URL('/api/documents', holiNextJSApiUrl)
  url.searchParams.append('type', docType)
  url.searchParams.append('locale', i18n.language)
  return url.href
}
