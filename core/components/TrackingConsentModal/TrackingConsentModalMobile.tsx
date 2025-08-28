import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowLeft } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

import GeneralContent from './GeneralContent'
import ManageOptionsContent from './ManageOptionsContent'
import { useConsentModal } from './useConsentModal'
import { useConsentModalState } from './useConsentModalState'
import { Button } from 'holi-bricks/components/button'

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
    allowAdPartnerAnalytics,
    onTogglePersonalization,
    onToggleProductAnalytics,
    onToggleAdPartnerAnalytics,
    acceptAll,
    denyAll,
    acceptMyChoices,
  } = useConsentModalState(closeAllModals)

  return (
    <>
      {/* General layer */}
      <HoliModal label="" shown={generalLayerVisible} style={styles.modal}>
        <ScrollView>
          <HoliContainer>
            <GeneralContent />
            <HoliGap size="ml" />
            {/* Buttons */}
            <Button
              label={t('tracking.consentModal.general.button.acceptAll')}
              onPress={acceptAll}
              testID="btn-consentModal-acceptAll"
            />
            <HoliGap size="s" />
            <Button
              label={t('tracking.consentModal.general.button.denyAll')}
              onPress={denyAll}
              variant="secondary"
              testID="btn-consentModal-declineAll"
            />
            <HoliGap size="s" />
            <Button
              label={t('tracking.consentModal.general.button.manageOptions')}
              onPress={goManageOptions}
              variant="secondary"
              testID="btn-consentModal-manageOptions"
            />
            <HoliGap size="l" />
          </HoliContainer>
        </ScrollView>
      </HoliModal>

      {/* Manage Options layer */}
      <HoliModal
        label={t('tracking.consentModal.general.button.manageOptions')}
        shown={optionsLayerVisible}
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
              onTogglePersonalization={onTogglePersonalization}
              allowProductAnalytics={allowProductAnalytics}
              onToggleProductAnalytics={onToggleProductAnalytics}
              allowAdPartnerAnalytics={allowAdPartnerAnalytics}
              onToggleAdPartnerAnalytics={onToggleAdPartnerAnalytics}
            />

            <HoliGap size="ml" />

            {/* Buttons */}
            <Button label={t('tracking.consentModal.manageOptions.button.acceptAll')} onPress={acceptAll} />
            <HoliGap size="m" />
            <Button
              label={t('tracking.consentModal.manageOptions.button.confirmMyChoices')}
              onPress={acceptMyChoices}
              variant="secondary"
            />
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
