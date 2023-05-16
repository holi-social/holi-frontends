import { useCallback, useEffect, useRef } from 'react'
import { Clipboard, Platform, Share } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'

export type UseShareSpace = [string, () => void]

export const useShareSpace = (title: string, slug: string): UseShareSpace => {
  const url = useRef('')
  const { displayError } = useErrorHandling()

  useEffect(() => {
    // Dynamic imports in async contexts currently lead to segfaults in jest (https://github.com/nodejs/node/issues/35889 / https://github.com/nodejs/node/issues/43205)
    if (!process?.env?.JEST_WORKER_ID) {
      import('expo-linking').then((Linking) => (url.current = Linking.createURL(slug)))
    } else {
      url.current = slug
    }
  }, [slug])

  const shareSpaceMobile = useCallback(async () => {
    try {
      await Share.share({
        message: title + (Platform.OS === 'android' ? `: ${url.current}` : ''),
        url: url.current,
      })
    } catch (error) {
      displayError(error)
    }
  }, [displayError, title])

  const shareSpaceWeb = useCallback(() => {
    Clipboard.setString(url.current)
  }, [])

  const shareSpace = Platform.OS === 'web' ? shareSpaceWeb : shareSpaceMobile

  return [url.current, shareSpace]
}
