import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native-unistyles'

import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'

export const NotificationsEmptyPlaceholder: React.FC = () => {
  const { t } = useTranslation()

  const firstText = t('notifications.display.empty.text1')
  const secondText = t('notifications.display.empty.text2')

  return (
    <HoliContainer>
      <HoliNoResults
        firstText={firstText}
        media={
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/illustrations/illustration_settings.svg')}
            width={152}
            height={152}
            label=""
            isSvg
          />
        }
        secondText={secondText}
        style={styles.noResultsMessage}
      />
    </HoliContainer>
  )
}

const styles = StyleSheet.create({
  noResultsMessage: {
    marginTop: 24,
  },
})
