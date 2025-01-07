import type React from 'react'
import { useTranslation } from 'react-i18next'
import { type StyleProp, View, type ViewStyle } from 'react-native'

import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import { type Space, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { Share as ShareIcon } from '@holi/icons/src/generated'
import { Button } from 'holi-bricks/components/button'

type SpaceShareProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceShare: React.FC<SpaceShareProps> = ({ space, style }: SpaceShareProps) => {
  const { t } = useTranslation()
  const [, shareLink] = useShareLink({
    link: `/spaces/${space.name}`,
    linkType: LinkType.UNIVERSAL,
    message: `${t('spaces.share.message.title')}\n${t('spaces.share.message.text', {
      space: space.title,
      interpolation: { escapeValue: false },
    })}`,
  })

  const isCollaborator = space.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const isAdministrator = space.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  return isCollaborator || isAdministrator ? (
    <View style={style}>
      <Button
        inline
        variant="secondary"
        size="sm"
        label={t('spaces.share')}
        onPress={shareLink}
        icon={ShareIcon}
        testID="space-share-btn"
      />
    </View>
  ) : null
}

export default SpaceShare
