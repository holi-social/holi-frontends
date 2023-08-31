import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Clipboard, Platform, Share } from 'react-native'

import { holiNextJSApiUrl } from '@holi/api/config'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

export enum LinkType {
  /**
   * Links to external pages, video calls etc.
   */
  EXTERNAL = 'EXTERNAL',
  /**
   * Universal web links, that can also act as deep links.
   */
  UNIVERSAL = 'UNIVERSAL',
  /**
   * Deep links (scheme holi:// on mobile, requires the app to be installed)
   */
  DEEP = 'DEEP',
}

export type UseShareLink = [string, () => Promise<void>]
export interface UseShareLinkProps {
  link: string
  linkType?: LinkType
  message: string
}

export const useShareLink = ({ link, message, linkType = LinkType.DEEP }: UseShareLinkProps): UseShareLink => {
  const url = useRef('')
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()
  const { t } = useTranslation()

  useEffect(() => {
    if (linkType === LinkType.UNIVERSAL && Platform.OS !== 'web') {
      url.current = `${holiNextJSApiUrl}${link}`
    } else if ([LinkType.DEEP, LinkType.UNIVERSAL].includes(linkType) && !process?.env?.JEST_WORKER_ID) {
      // Dynamic imports in async contexts currently lead to segfaults in jest (https://github.com/nodejs/node/issues/35889 / https://github.com/nodejs/node/issues/43205)
      import(/* webpackPrefetch: true */ 'expo-linking').then((Linking) => (url.current = Linking.createURL(link)))
    } else {
      url.current = link
    }
  }, [link, linkType])

  const shareLinkMobile = useCallback(async () => {
    try {
      // Add url to message on android as `url` parameter is not supported
      const messageUrlSuffix = Platform.OS === 'android' ? (message && '\n') + url.current : ''
      const result = await Share.share({
        message: message + messageUrlSuffix,
        url: url.current,
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      displayError(error)
    }
  }, [message, displayError])

  const shareLinkWeb = useCallback(async () => {
    const messageWithUrl = message + (message && '\n') + url.current
    Clipboard.setString(messageWithUrl)
    openToast(t('global.share.copied'), HoliToastType.SUCCESS)
  }, [message, openToast, t])

  const shareLink = Platform.OS === 'web' ? shareLinkWeb : shareLinkMobile

  return [url.current, shareLink]
}
