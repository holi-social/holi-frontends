import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'

import GeneralContent from './GeneralContent'
import ManageOptionsContent from './ManageOptionsContent'
import { useConsentModal } from './useConsentModal'
import { useConsentModalState } from './useConsentModalState'

export const TrackingConsentModalDesktop = () => {
  const { t } = useTranslation()

  // Modal management
  const { visible, hide } = useConsentModal()

  const {
    allowPersonalization,
    allowProductAnalytics,
    onPersonalizationChange,
    onProductAnalyticsChange,
    acceptAll,
    declineAll,
    acceptMyChoices,
  } = useConsentModalState(hide)

  return (
    <HoliModal label="" show={visible} style={styles.modal} desktop>
      <ScrollView>
        <HoliBox padding={32}>
          <GeneralContent />

          <HoliGap size="ml" />

          <ManageOptionsContent
            allowPersonalization={allowPersonalization}
            onPersonalizationChange={onPersonalizationChange}
            allowProductAnalytics={allowProductAnalytics}
            onProductAnalyticsChange={onProductAnalyticsChange}
          />
        </HoliBox>
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttonsSection}>
        <HoliBox padding={16} layout={styles.flexRow}>
          <HoliButton
            label={t('tracking.consentModal.manageOptions.button.confirmMyChoices')}
            inline
            disabled={!allowPersonalization && !allowProductAnalytics}
            onPress={acceptMyChoices}
            type="secondary"
            style={styles.firstButton}
          >
            {t('tracking.consentModal.manageOptions.button.confirmMyChoices')}
          </HoliButton>

          <HoliButton
            label={t('tracking.consentModal.general.button.declineAll')}
            inline
            onPress={declineAll}
            type="secondary"
          >
            {t('tracking.consentModal.general.button.declineAll')}
          </HoliButton>

          <HoliGap direction="horizontal" size="s" />

          <HoliButton label={t('tracking.consentModal.manageOptions.button.acceptAll')} inline onPress={acceptAll}>
            {t('tracking.consentModal.manageOptions.button.acceptAll')}
          </HoliButton>
        </HoliBox>
      </View>
    </HoliModal>
  )
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: colors.gray100,
  },
  buttonsSection: {
    backgroundColor: colors.background10,
    borderColor: colors.gray100,
    borderTopWidth: 1,
  },
  firstButton: {
    marginRight: 'auto',
  },
  flexRow: {
    flexDirection: 'row',
  },
})
