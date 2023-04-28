import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import DefaultScrollHeaderLayout from '@holi/core/components/DefaultScrollHeaderLayout'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface SpaceFormScreenLayoutProps {
  title?: string
  description?: string
  onDismiss: () => void
  onSave: () => void
  showConfirmationModal: boolean
  saveButtonDisabled: boolean
  saveButtonLoading: boolean
  children: React.ReactNode
}

const SpaceFormScreenLayout: React.FC<SpaceFormScreenLayoutProps> = ({
  onDismiss,
  onSave,
  saveButtonDisabled,
  saveButtonLoading,
  showConfirmationModal,
  children,
}) => {
  const { height: deviceHeight } = useWindowDimensions()
  const { navigateBack } = useUnifiedNavigation()
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const exitConfirmationTitle = t('global.leavePage.confirmation.title')

  return (
    <SpaceTermContextProvider>
      <DefaultScrollHeaderLayout
        style={styles.defaultLayout}
        contentStyle={styles.contentStyle}
        headerOverlap
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[mixins.container, styles.container, { minHeight: deviceHeight, paddingTop: vars.topBarHeight + 40 }]}
        >
          {!!title && <HoliText size="large">{title}</HoliText>}
          {!!description && <HoliText style={styles.description}>{description}</HoliText>}
          {children}
        </View>
      </DefaultScrollHeaderLayout>

      {/* Footer */}
      <View style={styles.footerContainer}>
        <View style={[mixins.container, styles.footer]}>
          <HoliButton
            label={t('global.dismiss')}
            type="secondary"
            inline
            style={styles.footerButton}
            onPress={onDismiss}
          >
            {t('global.dismiss')}
          </HoliButton>
          <HoliButtonLoading
            disabled={saveButtonDisabled || saveButtonLoading}
            icon={saveButtonLoading ? 'loader-4' : undefined}
            iconSpinning={saveButtonLoading}
            label={t('global.save')}
            onPress={onSave}
            testID="form-modal-save-btn"
            style={styles.footerButton}
          />
        </View>
      </View>

      <HoliConfirmation
        show={showConfirmationModal}
        label={exitConfirmationTitle}
        title={exitConfirmationTitle}
        description={t('global.leavePage.confirmation.description')}
        onDismiss={onDismiss}
        dismissText={t('global.dismiss')}
        confirmText={t('global.leavePage.confirmation.button')}
        testID="form-modal-exit-confirmation"
        onConfirm={() => {
          onDismiss()
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
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    margin: -7,
    ...Platform.select({
      web: {
        alignSelf: 'center',
        position: 'fixed',
      },
    }),
  },
  footerButton: {
    flex: 1,
    margin: 7,
    ...Platform.select({
      web: {
        margin: 0,
      },
    }),
  },
})
