import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export const NotificationsEmptyPlaceholder: React.FC = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const firstText = t('notifications.display.empty.text1')
  const secondText = t('notifications.display.empty.text2')

  return (
    <View style={mixins.container}>
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
    </View>
  )
}

const styles = StyleSheet.create({
  noResultsMessage: {
    marginTop: 24,
  },
})
