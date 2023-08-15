import React from 'react'
import { useTranslation } from 'react-i18next'
import { Clipboard, Platform, Pressable, StyleSheet } from 'react-native'

import { useShareLink } from '@holi/core/hooks/useShareLink'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Share as ShareIcon } from '@holi/icons/src/generated'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors } from '@holi/ui/styles/globalVars'

type SpaceShareIconProps = {
  spaceIdOrName?: string
  color?: string
  title?: string | null
}

const SpaceShareIcon: React.VFC<SpaceShareIconProps> = ({ spaceIdOrName, title, color }: SpaceShareIconProps) => {
  const { t } = useTranslation()
  const [url, onShareMobile] = useShareLink(title ?? '', `/spaces/${spaceIdOrName}`)
  const { openToast } = useToast()

  const onShare = () => {
    Clipboard.setString(url)
    openToast(t('spaces:spaces.share.copied'), HoliToastType.SUCCESS)
  }

  const isWeb = Platform.OS === 'web'

  return (
    <>
      <Pressable onPress={isWeb ? onShare : onShareMobile} testID="space-share-btn">
        <HoliIcon icon={ShareIcon} style={styles.shareIcon} color={color} />
      </Pressable>
    </>
  )
}

export default SpaceShareIcon

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  backdrop: {
    opacity: 0.4,
    backgroundColor: colors.foreground30,
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
  },
  description: {
    marginTop: 8,
    color: colors.foreground20,
  },
  modalView: {
    maxWidth: 460,
    padding: 24,
    margin: 25,
    alignSelf: 'center',
    backgroundColor: colors.background10,
    borderWidth: 2,
    borderRadius: 24,
    borderColor: colors.foreground30,
    shadowColor: colors.foreground30,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  copiedText: {
    color: colors.error20,
  },
  shareIcon: {
    marginRight: 10, // Adjust the margin value as needed
  },
})
