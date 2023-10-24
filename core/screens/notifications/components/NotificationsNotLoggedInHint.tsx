import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export const NotificationsNotLoggedInHint: React.FC<{
  onPress: () => void
}> = (props) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const firstText = t('loginRedirect.title')
  const secondText = t('loginRedirect.text')
  const label = t('loginRedirect.btnConfirm')

  const styles = StyleSheet.create({
    noResultsMessage: {
      marginTop: 24,
    },
  })

  return (
    <ScrollHeaderLayout.Default backgroundColor={colors.background30}>
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
        >
          <HoliButton label={label} onPress={props.onPress}>
            {label}
          </HoliButton>
        </HoliNoResults>
      </View>
    </ScrollHeaderLayout.Default>
  )
}
