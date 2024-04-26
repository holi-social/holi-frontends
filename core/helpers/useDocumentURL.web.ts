import { useTranslation } from 'react-i18next'

import type { DocType } from '@holi/web/pages/api/documents/index'

export const useDocumentURL = (docType?: DocType): string | undefined => {
  const { i18n } = useTranslation()

  if (!docType) {
    return
  }

  // create relative path for web
  const dummySafeBase = 'https://localhost:3000'
  const url = new URL('/api/documents', dummySafeBase)
  url.searchParams.append('type', docType)
  url.searchParams.append('locale', i18n.language)
  return url.pathname + url.search
}
