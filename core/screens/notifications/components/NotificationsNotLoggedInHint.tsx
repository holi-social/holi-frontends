import type React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet } from 'react-native'

import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { useTheme } from '@holi/ui/styles/theme'

export const NotificationsNotLoggedInHint: React.FC<{
  onPress: () => void
}> = (props) => {
  const { t } = useTranslation()

  const firstText = t('loginRedirect.title')
  const secondText = t('loginRedirect.text')
  const label = t('loginRedirect.btnConfirm')
  const { theme } = useTheme()
  const { colors } = theme

  const styles = StyleSheet.create({
    noResultsMessage: {
      marginTop: 24,
    },
  })

  return (
    <ScrollView style={{ backgroundColor: colors.background30 }}>
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
        >
          <HoliButton label={label} onPress={props.onPress}>
            {label}
          </HoliButton>
        </HoliNoResults>
      </HoliContainer>
    </ScrollView>
  )
}
