import type React from 'react'
import { useTranslation } from 'react-i18next'

import { LinkType, useShareLink } from '@holi/core/navigation/hooks/useShareLink'
import { Share as ShareIcon } from '@holi/icons/src/generated'
import { ButtonIcon } from 'holi-bricks/components/button'

type SpaceShareIconProps = {
  spaceIdOrName?: string
  color?: string
  title?: string | null
}

const SpaceShareIcon: React.FC<SpaceShareIconProps> = ({ spaceIdOrName, title }: SpaceShareIconProps) => {
  const { t } = useTranslation()
  const shareLink = useShareLink({
    link: `/spaces/${spaceIdOrName}`,
    linkType: LinkType.UNIVERSAL,
    message: `${t('spaces.share.message.title')}\n${t('spaces.share.message.text', {
      space: title,
      interpolation: { escapeValue: false },
    })}`,
  })

  return (
    <ButtonIcon
      onPress={shareLink}
      testID="space-share-btn"
      icon={ShareIcon}
      label="space-share-btn"
      transparent
      size="lg"
    />
  )
}

export default SpaceShareIcon
