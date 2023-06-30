import { Platform } from 'react-native'

import { holiNextJSApiUrl } from '@holi/api/config'
import type { DocType } from '@holi/web/pages/api/documents/index'

export const getDocumentURL = (docType?: DocType): string | undefined => {
  if (docType) {
    if (Platform.OS !== 'web') {
      // create absolute path for mobile
      const url = new URL('/api/documents', holiNextJSApiUrl)
      url.searchParams.append('type', docType)
      return url.href
    } else {
      // create relative path for web
      const dummySafeBase = 'https://localhost:3000'
      const url = new URL('/api/documents', dummySafeBase)
      url.searchParams.append('type', docType)
      return url.pathname + url.search
    }
  }
}
