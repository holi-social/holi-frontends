import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import OptionSection from '@holi/core/components/OptionSection'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Text } from 'holi-bricks/components/text'
import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'

interface Props {
  allowPersonalization: boolean
  onTogglePersonalization: () => void
  allowProductAnalytics: boolean
  onToggleProductAnalytics: () => void
  allowAdPartnerAnalytics: boolean
  onToggleAdPartnerAnalytics: () => void
}

const ManageOptionsContent = ({
  allowPersonalization,
  onTogglePersonalization,
  allowProductAnalytics,
  onToggleProductAnalytics,
  allowAdPartnerAnalytics,
  onToggleAdPartnerAnalytics,
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
          onToggle={onTogglePersonalization}
        />
      </View>

      <HoliGap size="sm" />

      <View style={styles.optionBox}>
        <OptionSection
          title={t('tracking.consentModal.manageOptions.productAnalyticsBox.title')}
          description={t('tracking.consentModal.manageOptions.productAnalyticsBox.description')}
          value={allowProductAnalytics}
          onToggle={onToggleProductAnalytics}
        />
      </View>

      <HoliGap size="sm" />

      <View style={styles.optionBox}>
        <OptionSection
          title={t('tracking.consentModal.manageOptions.adPartnerAnalyticsBox.title')}
          description={t('tracking.consentModal.manageOptions.adPartnerAnalyticsBox.description')}
          value={allowAdPartnerAnalytics}
          onToggle={onToggleAdPartnerAnalytics}
        />
      </View>

      <HoliGap size="m" />

      <Text>
        <Trans t={t} i18nKey="tracking.consentModal.manageOptions.privacyStatement">
          <HoliTextLink
            href="/profile/settings/legalDocuments/document?type=privacyPolicy"
            label={t('profile.settings.legalDocuments.privacyPolicy')}
            size="md"
          />
        </Trans>
      </Text>

      <HoliGap size="m" />

      <Text>{t('tracking.consentModal.manageOptions.note')}</Text>
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
