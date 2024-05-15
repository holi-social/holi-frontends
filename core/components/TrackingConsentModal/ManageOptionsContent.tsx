import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import OptionSection from '@holi/core/components/OptionSection'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface Props {
  allowPersonalization: boolean
  onPersonalizationChange: (value: boolean) => void
  allowProductAnalytics: boolean
  onProductAnalyticsChange: (value: boolean) => void
}

const ManageOptionsContent = ({
  allowPersonalization,
  onPersonalizationChange,
  allowProductAnalytics,
  onProductAnalyticsChange,
}: Props) => {
  const { t } = useTranslation()

  const { theme } = useTheme()
  const styles = getStyles(theme)

  return (
    <>
      <View style={styles.optionBox}>
        <OptionSection
          title={t('tracking.consentModal.manageOptions.personalizationBox.title')}
          description={t('tracking.consentModal.manageOptions.personalizationBox.description')}
          value={allowPersonalization}
          onChange={onPersonalizationChange}
        />
      </View>

      <HoliGap size="sm" />

      <View style={styles.optionBox}>
        <OptionSection
          title={t('tracking.consentModal.manageOptions.productAnalyticsBox.title')}
          description={t('tracking.consentModal.manageOptions.productAnalyticsBox.description')}
          value={allowProductAnalytics}
          onChange={onProductAnalyticsChange}
        />
      </View>

      <HoliGap size="m" />

      <HoliText>{t('tracking.consentModal.manageOptions.note')}</HoliText>
    </>
  )
}

export default ManageOptionsContent

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    optionBox: {
      backgroundColor: theme.colors.background10,
      borderWidth: 1,
      borderColor: theme.colors.gray200,
      borderRadius: 12,
    },
  })
