import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Trans } from 'react-i18next'
import { Platform, ScrollView, StyleSheet } from 'react-native'

import HoliModal, { useModalState } from '@holi//ui/components/molecules/HoliModal'
import CenteredImageHeadlineDescriptionLayout, {
  CenteredImageHeadlineDescriptionLayoutProps,
} from '@holi/core/auth/components/CenteredImageHeadlineDescriptionLayout'
import HtmlDocument from '@holi/core/components/HtmlDocument'
import { HoliBadRequestError } from '@holi/core/errors/classes/HoliBadRequestError'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliWizardNavigationButtons, {
  BUTTON_RECTS,
} from '@holi/ui/components/organisms/HoliWizard/HoliWizardNavigationButtons'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface AgreementProps {
  agreementValue: boolean
  onAgreementChange: () => void
}

interface AcceptDocumentLayoutProps extends AgreementProps, CenteredImageHeadlineDescriptionLayoutProps {
  docUrl?: string
  onNextPress?: () => void
  onBackPress?: () => void
  checkboxLabelTranslation: string
  documentNavPath: string
  modalLabelText: string
}

const AcceptDocumentLayout = ({
  docUrl,
  append,
  agreementValue,
  onAgreementChange,
  onNextPress,
  onBackPress,
  checkboxLabelTranslation,
  documentNavPath,
  modalLabelText,
  testID,
  ...centeredLayoutProps
}: AcceptDocumentLayoutProps) => {
  const { t } = useTranslation()
  const { show: showModal, hide: hideModal, props: modalProps } = useModalState()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const navButtons = (
    <HoliWizardNavigationButtons
      onNextPress={onNextPress}
      onBackPress={onBackPress}
      isNextButtonEnabled={agreementValue}
      style={styles.buttonContainer}
      testID={`${testID}-navbtn`}
    />
  )

  const onDocumentLoadError = (err?: Error | number) => {
    hideModal()
    if (err instanceof HoliBadRequestError) {
      openToast(t('profile.settings.legalDocuments.error.notFound'), HoliToastType.ERROR)
    } else {
      displayError(err, 'Failed to load document', {
        location: 'AcceptDocumentLayout.onDocumentLoadError',
        docUrl,
      })
    }
  }

  return (
    <CenteredImageHeadlineDescriptionLayout
      {...centeredLayoutProps}
      append={append || navButtons}
      contentContainerStyle={styles.outerContentContainerStyle}
      testID={testID}
    >
      <HoliCheckbox
        autofocus={false}
        checked={agreementValue}
        onSelect={onAgreementChange}
        style={styles.checkbox}
        testID={`${testID}-checkbox`}
        aria-label={checkboxLabelTranslation}
      >
        <HoliText size="small">
          <Trans t={t} i18nKey={checkboxLabelTranslation}>
            <HoliTextLink
              label=""
              href={documentNavPath}
              size="small"
              onPress={() => {
                showModal()
                return false
              }}
            />
          </Trans>
        </HoliText>
      </HoliCheckbox>

      <HoliModal label={modalLabelText} {...modalProps} autoHeight={false} relativeHeight={1} style={styles.modal}>
        <ScrollView style={styles.modalOuter} contentContainerStyle={styles.modalInner}>
          <HtmlDocument url={docUrl} onError={onDocumentLoadError} />
        </ScrollView>
      </HoliModal>
    </CenteredImageHeadlineDescriptionLayout>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    outerContentContainerStyle: {
      paddingBottom: BUTTON_RECTS.height + BUTTON_RECTS.paddingBottom,
    },
    checkbox: {
      marginTop: 24,
      maxWidth: '100%',
      alignSelf: 'center',
    },
    buttonContainer: {
      bottom: 0,
      paddingHorizontal: 24,
      alignItems: 'center',
      ...Platform.select({
        native: {
          position: 'absolute',
        },
        default: {
          position: 'fixed',
        },
      }),
      paddingBottom: BUTTON_RECTS.paddingBottom,
    },
    modal: {
      backgroundColor: theme.colors.background30,
    },
    modalOuter: {
      paddingHorizontal: 20,
      marginTop: 20,
      marginBottom: 50,
      maxWidth: dimensions.maxScreenWidth,
      alignSelf: 'center',
      flex: 1,
      width: '100%',
    },
    modalInner: {
      width: '100%',
    },
  })

export default AcceptDocumentLayout
