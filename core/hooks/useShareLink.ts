import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Share } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import Linking from 'expo-linking'
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

export type ShareLinkAction = 'shared' | 'dismissed'

export type UseShareLink = [string, () => Promise<ShareLinkAction>]
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
      url.current = Linking.createURL(link)
    } else {
      url.current = link
    }
  }, [link, linkType])

  const shareLinkMobile: () => Promise<ShareLinkAction> = useCallback(async () => {
    try {
      // Add url to message on android as `url` parameter is not supported
      const messageUrlSuffix = Platform.OS === 'android' ? (message && '\n') + url.current : ''
      const result = await Share.share({
        message: message + messageUrlSuffix,
        url: url.current,
      })
      switch (result.action) {
        case 'sharedAction':
          return 'shared'
        case 'dismissedAction':
          return 'dismissed'
      }
    } catch (error) {
      displayError(error, 'Failed to share link', {
        location: 'useShareLink.shareLinkMobile',
      })
      throw error
    }
  }, [message, displayError])

  const shareLinkWeb: () => Promise<ShareLinkAction> = useCallback(async () => {
    Clipboard.setString(url.current)
    openToast(t('global.share.copied'), HoliToastType.SUCCESS)
    return 'shared'
  }, [openToast, t])

  const shareLink = Platform.OS === 'web' ? shareLinkWeb : shareLinkMobile

  return [url.current, shareLink]
}
