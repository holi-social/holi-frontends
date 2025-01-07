import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowLeft } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import GeneralContent from './GeneralContent'
import ManageOptionsContent from './ManageOptionsContent'
import { useConsentModal } from './useConsentModal'
import { useConsentModalState } from './useConsentModalState'

export const TrackingConsentModalMobile = () => {
  const { t } = useTranslation()

  const { theme } = useTheme()
  const styles = getStyles(theme)

  // Modal management
  const { visible: generalLayerVisible, show: showGeneralLayer, hide: hideGeneralLayer } = useConsentModal()
  const { visible: optionsLayerVisible, show: showOptionsLayer, hide: hideOptionsLayer } = useModalState()

  const goManageOptions = () => {
    hideGeneralLayer()
    setTimeout(() => requestAnimationFrame(showOptionsLayer), 200)
  }

  const goBackToGeneralLayer = () => {
    hideOptionsLayer()
    setTimeout(() => requestAnimationFrame(showGeneralLayer), 200)
  }

  const closeAllModals = () => {
    hideGeneralLayer()
    hideOptionsLayer()
  }

  const {
    allowPersonalization,
    allowProductAnalytics,
    onPersonalizationChange,
    onProductAnalyticsChange,
    acceptAll,
    declineAll,
    acceptMyChoices,
  } = useConsentModalState(closeAllModals)

  return (
    <>
      {/* General layer */}
      <HoliModal label="" show={generalLayerVisible} style={styles.modal}>
        <ScrollView>
          <HoliContainer>
            <GeneralContent />

            <HoliGap size="ml" />

            {/* Buttons */}
            <HoliButton
              label={t('tracking.consentModal.general.button.acceptAll')}
              onPress={acceptAll}
              testID="btn-consentModal-acceptAll"
            >
              {t('tracking.consentModal.general.button.acceptAll')}
            </HoliButton>

            <HoliGap size="s" />

            <HoliButton
              label={t('tracking.consentModal.general.button.declineAll')}
              onPress={declineAll}
              type="secondary"
              testID="btn-consentModal-declineAll"
            >
              {t('tracking.consentModal.general.button.declineAll')}
            </HoliButton>

            <HoliGap size="s" />

            <HoliButton
              label={t('tracking.consentModal.general.button.manageOptions')}
              onPress={goManageOptions}
              type="secondary"
              testID="btn-consentModal-manageOptions"
            >
              {t('tracking.consentModal.general.button.manageOptions')}
            </HoliButton>

            <HoliGap size="l" />
          </HoliContainer>
        </ScrollView>
      </HoliModal>

      {/* Manage Options layer */}
      <HoliModal
        label={t('tracking.consentModal.general.button.manageOptions')}
        show={optionsLayerVisible}
        style={styles.modal}
        heading={t('tracking.consentModal.general.button.manageOptions')}
        onDismiss={goBackToGeneralLayer}
        dismissBtnContent={<HoliIcon icon={ArrowLeft} />}
      >
        <ScrollView>
          <HoliContainer>
            {/* Content */}
            <ManageOptionsContent
              allowPersonalization={allowPersonalization}
              onPersonalizationChange={onPersonalizationChange}
              allowProductAnalytics={allowProductAnalytics}
              onProductAnalyticsChange={onProductAnalyticsChange}
            />

            <HoliGap size="ml" />

            {/* Buttons */}
            <HoliButton label={t('tracking.consentModal.manageOptions.button.acceptAll')} onPress={acceptAll}>
              {t('tracking.consentModal.manageOptions.button.acceptAll')}
            </HoliButton>

            <HoliGap size="m" />

            <HoliButton
              label={t('tracking.consentModal.manageOptions.button.confirmMyChoices')}
              onPress={acceptMyChoices}
              type="secondary"
            >
              {t('tracking.consentModal.manageOptions.button.confirmMyChoices')}
            </HoliButton>

            <HoliGap size="l" />
          </HoliContainer>
        </ScrollView>
      </HoliModal>
    </>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    modal: {
      backgroundColor: theme.colors.background30,
    },
    flexRow: {
      flexDirection: 'row',
    },
  })
