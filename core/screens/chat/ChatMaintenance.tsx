import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { useTheme } from '@holi/ui/styles/theme'

const ChatMaintenance = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme

  return (
    <ScrollHeaderLayout.Default backgroundColor={colors.background20}>
      <HoliContainer>
        <HoliNoResults
          firstText={t('chat.maintenance.tagline')}
          media={
            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/illustrations/illustration_chat_maintenance.svg')}
              width={212}
              height={156}
              label=""
              isSvg
            />
          }
          secondText={t('chat.maintenance.headline')}
          style={[styles.noResultsMessage]}
        />
      </HoliContainer>
    </ScrollHeaderLayout.Default>
  )
}

export default memo(ChatMaintenance)

const styles = StyleSheet.create({
  noResultsMessage: {
    marginTop: 24,
  },
})
