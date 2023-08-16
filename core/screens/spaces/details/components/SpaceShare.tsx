import React from 'react'
import { useTranslation } from 'react-i18next'
import { Clipboard, Platform, StyleProp, ViewStyle } from 'react-native'

import { useShareLink } from '@holi/core/hooks/useShareLink'
import { Space, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { Share as ShareIcon } from '@holi/icons/src/generated'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

type SpaceShareProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceShare: React.VFC<SpaceShareProps> = ({ space, style }: SpaceShareProps) => {
  const { t } = useTranslation()
  const [url, onShareMobile] = useShareLink(space?.title ?? '', `/spaces/${space?.name}`)
  const { openToast } = useToast()

  const isCollaborator = space.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const isAdministrator = space.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  const onShareWeb = () => {
    Clipboard.setString(url)
    openToast(t('spaces.share.copied'), HoliToastType.SUCCESS)
  }

  return (
    <>
      {isCollaborator || isAdministrator ? (
        <HoliButtonLoading
          inline
          type="secondary"
          variant="small"
          label={t('spaces.share')}
          onPress={Platform.OS !== 'web' ? onShareMobile : onShareWeb}
          style={style}
          icon={ShareIcon}
          testID="space-share-btn"
        />
      ) : null}
    </>
  )
}

export default SpaceShare
