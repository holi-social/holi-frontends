import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Clipboard, Platform, Share } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

export type UseShareLink = [string, () => Promise<void>]
export interface UseShareLinkProps {
  link: string
  externalLink?: boolean
  createMessage?: (url: string) => string
}

export const useShareLink = ({ link, createMessage, externalLink = false }: UseShareLinkProps): UseShareLink => {
  const url = useRef('')
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()
  const { t } = useTranslation()

  useEffect(() => {
    // Dynamic imports in async contexts currently lead to segfaults in jest (https://github.com/nodejs/node/issues/35889 / https://github.com/nodejs/node/issues/43205)
    if (!process?.env?.JEST_WORKER_ID && !externalLink) {
      import(/* webpackPrefetch: true */ 'expo-linking').then((Linking) => (url.current = Linking.createURL(link)))
    } else {
      url.current = link
    }
  }, [link, externalLink])

  const shareLinkMobile = useCallback(async () => {
    try {
      const result = await Share.share({
        message: createMessage ? createMessage(url.current) : url.current,
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
  }, [createMessage, displayError])

  const shareLinkWeb = useCallback(async () => {
    const message = createMessage ? createMessage(url.current) : url.current
    Clipboard.setString(message)
    openToast(t('global.share.copied'), HoliToastType.SUCCESS)
  }, [createMessage, openToast, t])

  const shareLink = Platform.OS === 'web' ? shareLinkWeb : shareLinkMobile

  return [url.current, shareLink]
}
