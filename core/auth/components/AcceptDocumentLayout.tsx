import React from 'react'
import { useTranslation } from 'react-i18next'
import { Trans } from 'react-i18next'
import { Platform, ScrollView, StyleSheet } from 'react-native'

import HoliModal, { useModalState } from '@holi//ui/components/molecules/HoliModal'
import CenteredImageHeadlineDescriptionLayout, {
  CenteredImageHeadlineDescriptionLayoutProps,
} from '@holi/core/auth/components/CenteredImageHeadlineDescriptionLayout'
import HtmlDocument from '@holi/core/components/HtmlDocument'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextLink from '@holi/ui/components/atoms/HoliTextLink'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliWizardNaviagtionButtons, {
  BUTTON_RECTS,
} from '@holi/ui/components/organisms/HoliWizard/HoliWizardNaviagtionButtons'
import { colors } from '@holi/ui/styles/globalVars'
import { vars } from '@holi/ui/styles/globalVars'

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

  const navButtons = (
    <HoliWizardNaviagtionButtons
      onNextPress={onNextPress}
      onBackPress={onBackPress}
      isNextButtonEnabled={agreementValue}
      style={styles.buttonContainer}
      testID={`${testID}-navbtn`}
    />
  )

  const onDocumentLoadError = () => {
    hideModal()
    openToast(t('profile.settings.legalDocuments.error.notFound'), HoliToastType.ERROR, 3000)
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
        accessibilityLabel={checkboxLabelTranslation}
      >
        <HoliText size="small">
          <Trans t={t} i18nKey={checkboxLabelTranslation}>
            <HoliTextLink
              label=""
              href={documentNavPath}
              size="small"
              variant="secondary"
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

const styles = StyleSheet.create({
  outerContentContainerStyle: {
    paddingBottom: BUTTON_RECTS.height + BUTTON_RECTS.paddingBottom,
  },
  checkbox: {
    marginTop: 24,
    maxWidth: '100%',
    alignSelf: 'center',
  },
  labelLink: {
    fontSize: 14,
    lineHeight: 14 * 1.2,
    fontWeight: '700',
    color: colors.foreground30,
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
    backgroundColor: colors.background30,
  },
  modalOuter: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 50,
    maxWidth: vars.maxScreenWidth,
    alignSelf: 'center',
    flex: 1,
    width: '100%',
  },
  modalInner: {
    width: '100%',
  },
})

export default AcceptDocumentLayout
