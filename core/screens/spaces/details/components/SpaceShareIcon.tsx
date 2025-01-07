import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet } from 'react-native'

import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Share as ShareIcon } from '@holi/icons/src/generated'

type SpaceShareIconProps = {
  spaceIdOrName?: string
  color?: string
  title?: string | null
}

const SpaceShareIcon: React.FC<SpaceShareIconProps> = ({ spaceIdOrName, title, color }: SpaceShareIconProps) => {
  const { t } = useTranslation()
  const [, shareLink] = useShareLink({
    link: `/spaces/${spaceIdOrName}`,
    linkType: LinkType.UNIVERSAL,
    message: `${t('spaces.share.message.title')}\n${t('spaces.share.message.text', {
      space: title,
      interpolation: { escapeValue: false },
    })}`,
  })

  return (
    <>
      <Pressable onPress={shareLink} testID="space-share-btn">
        <HoliIcon icon={ShareIcon} style={styles.shareIcon} color={color} />
      </Pressable>
    </>
  )
}

export default SpaceShareIcon

const styles = StyleSheet.create({
  shareIcon: {
    marginRight: 10, // Adjust the margin value as needed
  },
})
