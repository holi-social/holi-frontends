import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

import GeneralContent from './GeneralContent'
import ManageOptionsContent from './ManageOptionsContent'
import { useConsentModal } from './useConsentModal'
import { useConsentModalState } from './useConsentModalState'
import { Button } from 'holi-bricks/components/button'

export const TrackingConsentModalDesktop = () => {
  const { t } = useTranslation()

  const { theme } = useTheme()
  const styles = getStyles(theme)

  // Modal management
  const { visible, hide } = useConsentModal()

  const {
    allowPersonalization,
    allowProductAnalytics,
    allowAdPartnerAnalytics,
    onTogglePersonalization,
    onToggleProductAnalytics,
    onToggleAdPartnerAnalytics,
    acceptAll,
    denyAll,
    acceptMyChoices,
  } = useConsentModalState(hide)

  return (
    <HoliModal label="" shown={visible} style={styles.modal} desktop>
      <ScrollView>
        <HoliBox padding={32}>
          <GeneralContent hideDescription />

          <HoliGap size="ml" />

          <ManageOptionsContent
            allowPersonalization={allowPersonalization}
            onTogglePersonalization={onTogglePersonalization}
            allowProductAnalytics={allowProductAnalytics}
            onToggleProductAnalytics={onToggleProductAnalytics}
            allowAdPartnerAnalytics={allowAdPartnerAnalytics}
            onToggleAdPartnerAnalytics={onToggleAdPartnerAnalytics}
          />
        </HoliBox>
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttonsSection}>
        <HoliBox padding={16} layout={styles.flexRow}>
          <View style={styles.firstButton}>
            <Button
              label={t('tracking.consentModal.manageOptions.button.confirmMyChoices')}
              inline
              disabled={!allowPersonalization && !allowProductAnalytics}
              onPress={acceptMyChoices}
              variant="secondary"
            />
          </View>
          <Button
            label={t('tracking.consentModal.general.button.denyAll')}
            inline
            onPress={denyAll}
            variant="secondary"
          />
          <HoliGap direction="horizontal" size="s" />
          <Button label={t('tracking.consentModal.manageOptions.button.acceptAll')} inline onPress={acceptAll} />
        </HoliBox>
      </View>
    </HoliModal>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    modal: {
      backgroundColor: theme.colors.gray100,
      maxWidth: dimensions.maxScreenWidth,
    },
    buttonsSection: {
      backgroundColor: theme.colors.background10,
      borderColor: theme.colors.gray100,
      borderTopWidth: 1,
    },
    firstButton: {
      marginRight: 'auto',
    },
    flexRow: {
      flexDirection: 'row',
    },
  })
