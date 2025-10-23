import { useCallback, useEffect, useRef } from 'react'
import { Platform, Share } from 'react-native'
import Linking from 'expo-linking'
import { holiNextJSApiUrl } from '@holi/api/config'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { LinkType, type UseShareLink, type UseShareLinkProps } from '@holi/core/navigation/hooks/useShareLink/types'

export const useShareLink = ({ link, message, linkType = LinkType.DEEP }: UseShareLinkProps): UseShareLink => {
  const url = useRef('')
  const { displayError } = useErrorHandling()

  useEffect(() => {
    if (linkType === LinkType.UNIVERSAL && Platform.OS !== 'web') {
      url.current = `${holiNextJSApiUrl}${link}`
    } else if ([LinkType.DEEP, LinkType.UNIVERSAL].includes(linkType) && !process?.env?.JEST_WORKER_ID) {
      url.current = Linking.createURL(link)
    } else {
      url.current = link
    }
  }, [link, linkType])

  const shareLink = useCallback(async () => {
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

  return shareLink
}

export { LinkType }
