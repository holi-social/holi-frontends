import React from 'react'
import { Pressable, StyleSheet } from 'react-native'

import { useShareLink } from '@holi/core/hooks/useShareLink'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Share as ShareIcon } from '@holi/icons/src/generated'

type SpaceShareIconProps = {
  spaceIdOrName?: string
  color?: string
  title?: string | null
}

const SpaceShareIcon: React.VFC<SpaceShareIconProps> = ({ spaceIdOrName, title, color }: SpaceShareIconProps) => {
  const [, shareLink] = useShareLink(title ?? '', `/spaces/${spaceIdOrName}`)

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
