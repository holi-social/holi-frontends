import type React from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import FormWrapper from '@holi/core/components/FormWrapper'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface SpaceFormScreenLayoutProps {
  title?: string
  description?: string
  onSave: () => Promise<unknown>
  toggleConfirmationModal: (showConfirmation: boolean) => void
  showConfirmationModal: boolean
  saveButtonDisabled: boolean
  children: React.ReactNode
  fallbackRoute?: string
}

const SpaceFormScreenLayout: React.FC<SpaceFormScreenLayoutProps> = ({
  title,
  description,
  toggleConfirmationModal,
  onSave,
  saveButtonDisabled,
  showConfirmationModal,
  children,
  fallbackRoute,
}) => {
  const { height: deviceHeight } = useWindowDimensions()
  const { navigateBack } = useRouting()
  const { t } = useTranslation()
  const exitConfirmationTitle = t('global.leavePage.confirmation.title')
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <>
      <FormWrapper
        onSave={onSave}
        saveButtonDisabled={saveButtonDisabled}
        onBack={() => toggleConfirmationModal(true)}
        showBackButton
        style={styles.defaultLayout}
        behavior="padding"
        scrollToInput={false}
        keyboardShouldPersistTaps="handled"
        renderProp={() => (
          <View
            style={{
              minHeight: deviceHeight,
              paddingBottom: dimensions.bottomBarHeight + Spacing.md,
            }}
          >
            {!!title && (
              <HoliHeading level="1" size="m">
                {title}
              </HoliHeading>
            )}
            {!!description && <HoliText style={styles.description}>{description}</HoliText>}
            {children}
          </View>
        )}
      />

      <HoliConfirmation
        show={showConfirmationModal}
        label={exitConfirmationTitle}
        title={exitConfirmationTitle}
        description={t('global.leavePage.confirmation.description')}
        onDismiss={() => toggleConfirmationModal(false)}
        secondaryText={t('global.leavePage.confirmation.dismiss')}
        primaryText={t('global.leavePage.confirmation.confirm')}
        testID="form-modal-exit-confirmation"
        onPrimary={() => {
          toggleConfirmationModal(false)
          navigateBack(fallbackRoute)
        }}
      />
    </>
  )
}

export default SpaceFormScreenLayout

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    defaultLayout: {
      backgroundColor: theme.colors.background20,
      paddingTop: 16,
      paddingBottom: Spacing.xxl,
      height: '100%',
      flex: 1,
    },
    description: {
      marginBottom: 32,
      marginTop: 16,
      color: theme.colors.foreground20,
    },
  })
