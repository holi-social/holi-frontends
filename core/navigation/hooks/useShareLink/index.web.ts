import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Clipboard from '@react-native-clipboard/clipboard'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import {
  LinkType,
  type ShareLinkAction,
  type UseShareLink,
  type UseShareLinkProps,
} from '@holi/core/navigation/hooks/useShareLink/types'

export const useShareLink = ({ link }: UseShareLinkProps): UseShareLink => {
  const { openToast } = useToast()
  const { t } = useTranslation()

  const shareLink = useCallback(async () => {
    Clipboard.setString(link)
    openToast(t('global.share.copied'), HoliToastType.SUCCESS)
    return Promise.resolve<ShareLinkAction>('shared')
  }, [openToast, t, link])

  return shareLink
}

export { LinkType }
