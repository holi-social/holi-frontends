import { Platform } from 'react-native'

import { holiNextJSApiUrl } from '@holi/api/config'
import { DocType } from '@holi/core/documents/DocType'

export const getDocumentURL = (docType: DocType): string => {
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

export const withProtocol = (address: string) =>
  address.startsWith('https://') || address.startsWith('http://') ? address : `https://${address}`

export const shortHost = (url: string) => new URL(url).host.replace(/^(www.)/, '')
