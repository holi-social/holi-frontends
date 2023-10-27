import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { useKeyboard } from '@holi/ui/helper'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface SpaceFormScreenLayoutProps {
  title?: string
  description?: string
  onSave: () => Promise<unknown>
  toggleConfirmationModal: (showConfirmation: boolean) => void
  showConfirmationModal: boolean
  saveButtonDisabled: boolean
  children: React.ReactNode
}

const SpaceFormScreenLayout: React.FC<SpaceFormScreenLayoutProps> = ({
  title,
  description,
  toggleConfirmationModal,
  onSave,
  saveButtonDisabled,
  showConfirmationModal,
  children,
}) => {
  const { height: deviceHeight } = useWindowDimensions()
  const { navigateBack } = useRouting()
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const exitConfirmationTitle = t('global.leavePage.confirmation.title')
  const { isKeyboardOpen } = useKeyboard()
  const hideFooter = Platform.OS === 'android' && isKeyboardOpen

  return (
    <SpaceTermContextProvider>
      <ScrollHeaderLayout.Default
        style={styles.defaultLayout}
        contentStyle={styles.contentStyle}
        headerOverlap
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[mixins.container, styles.container, { minHeight: deviceHeight, paddingTop: vars.topBarHeight + 40 }]}
        >
          {!!title && (
            <HoliHeading level="1" size="medium">
              {title}
            </HoliHeading>
          )}
          {!!description && <HoliText style={styles.description}>{description}</HoliText>}
          {children}
        </View>
      </ScrollHeaderLayout.Default>

      {/* Footer */}
      {!hideFooter && (
        <View style={styles.footerContainer}>
          <View style={[mixins.container, styles.footer]}>
            <HoliButton
              label={t('global.dismiss')}
              type="secondary"
              inline
              style={styles.footerButton}
              onPress={() => toggleConfirmationModal(true)}
            >
              {t('global.dismiss')}
            </HoliButton>
            <HoliButtonLoading
              disabled={saveButtonDisabled}
              label={t('global.save')}
              onPress={onSave}
              testID="form-modal-save-btn"
              style={styles.footerButton}
            />
          </View>
        </View>
      )}

      <HoliConfirmation
        show={showConfirmationModal}
        label={exitConfirmationTitle}
        title={exitConfirmationTitle}
        description={t('global.leavePage.confirmation.description')}
        onDismiss={() => toggleConfirmationModal(false)}
        dismissText={t('global.leavePage.confirmation.dismiss')}
        confirmText={t('global.leavePage.confirmation.confirm')}
        testID="form-modal-exit-confirmation"
        onConfirm={() => {
          toggleConfirmationModal(false)
          navigateBack()
        }}
      />
    </SpaceTermContextProvider>
  )
}

export default SpaceFormScreenLayout

const styles = StyleSheet.create({
  defaultLayout: {
    backgroundColor: colors.background20,
    paddingTop: 16,
  },
  contentStyle: {
    paddingBottom: 0,
  },
  container: {
    flex: 1,
    paddingBottom: 132,
    ...Platform.select({
      native: {
        maxWidth: '100%',
      },
    }),
  },
  description: {
    marginBottom: 32,
    marginTop: 16,
    color: colors.foreground20,
  },
  footerContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  footer: {
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    ...Platform.select({
      web: {
        alignSelf: 'center',
        position: 'fixed',
      },
    }),
  },
  footerButton: {
    flex: 1,
  },
})
