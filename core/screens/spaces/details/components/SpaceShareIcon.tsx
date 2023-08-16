import React from 'react'
import { useTranslation } from 'react-i18next'
import { Clipboard, Platform, Pressable, StyleSheet } from 'react-native'

import { useShareLink } from '@holi/core/hooks/useShareLink'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Share as ShareIcon } from '@holi/icons/src/generated'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

type SpaceShareIconProps = {
  spaceIdOrName?: string
  color?: string
  title?: string | null
}

const SpaceShareIcon: React.VFC<SpaceShareIconProps> = ({ spaceIdOrName, title, color }: SpaceShareIconProps) => {
  const { t } = useTranslation()
  const [url, onShareMobile] = useShareLink(title ?? '', `/spaces/${spaceIdOrName}`)
  const { openToast } = useToast()

  const onShareWeb = () => {
    Clipboard.setString(url)
    openToast(t('spaces.share.copied'), HoliToastType.SUCCESS)
  }

  const isWeb = Platform.OS === 'web'

  return (
    <>
      <Pressable onPress={isWeb ? onShareWeb : onShareMobile} testID="space-share-btn">
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
