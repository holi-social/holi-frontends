import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Trans } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'

import HoliModal, { useModalState } from '@holi//ui/components/molecules/HoliModal'
import CenteredContentLayout from '@holi/core/components/CenteredContentLayout'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextLink from '@holi/ui/components/atoms/HoliTextLink'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
import HoliWizardNaviagtionButtons, {
  BUTTON_RECTS,
} from '@holi/ui/components/organisms/HoliWizard/HoliWizardNaviagtionButtons'
import { colors } from '@holi/ui/styles/globalVars'
import { vars } from '@holi/ui/styles/globalVars'

interface AcceptDocumentLayoutProps {
  append?: React.ReactNode
  onNextPress?: () => void
  onBackPress?: () => void
  imageSource: StaticImageData
  imageLabelText: string
  headlineText: string
  descriptionText: string
  checkboxLabelTranslation: string
  documentNavPath: string
  modalLabelText: string
  testID?: string
}

const AcceptDocumentLayout = ({
  children,
  append,
  onNextPress,
  onBackPress,
  imageSource,
  imageLabelText,
  headlineText,
  descriptionText,
  checkboxLabelTranslation,
  documentNavPath,
  modalLabelText,
  testID,
}: React.PropsWithChildren<AcceptDocumentLayoutProps>) => {
  const { t } = useTranslation()
  const [accepted, setAccepted] = useState(false)
  const { show: showModal, props: modalProps } = useModalState()

  const navButtons = (
    <HoliWizardNaviagtionButtons
      onNextPress={onNextPress}
      onBackPress={onBackPress}
      isNextButtonEnabled={accepted}
      style={styles.buttonContainer}
    />
  )

  return (
    <CenteredContentLayout append={append || navButtons} contentContainerStyle={styles.outerContentContainerStyle}>
      <View style={styles.inner}>
        <View style={styles.imageContainer}>
          <HoliLocalImage
            imageSource={imageSource}
            isSvg
            width={251}
            height={181}
            label={imageLabelText}
            resizeMode="contain"
          />
        </View>

        <HoliHeading level="1" size="medium" style={styles.headline} testID={`${testID}-headline`}>
          {headlineText}
        </HoliHeading>

        <HoliText style={styles.description}>{descriptionText}</HoliText>
      </View>

      <HoliCheckbox
        autofocus={false}
        checked={accepted}
        onSelect={() => setAccepted((value) => !value)}
        style={styles.checkbox}
        testID={`${testID}-checkbox`}
      >
        <View>
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
        </View>
      </HoliCheckbox>

      <HoliModal label={modalLabelText} {...modalProps} autoHeight={false} relativeHeight={1} style={styles.modal}>
        <ScrollView style={styles.modalContent} contentContainerStyle={{ maxWidth: '100%' }}>
          {children}
        </ScrollView>
      </HoliModal>
    </CenteredContentLayout>
  )
}

const styles = StyleSheet.create({
  outerContentContainerStyle: {
    paddingBottom: BUTTON_RECTS.height + BUTTON_RECTS.paddingBottom,
  },
  inner: {
    alignItems: 'center',
    maxWidth: vars.breakpointL,
  },
  imageContainer: {
    alignItems: 'center',
  },
  headline: {
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 74,
  },
  description: {
    color: colors.foreground20,
    marginTop: 16,
    textAlign: 'center',
  },
  checkbox: {
    marginTop: 24,
    maxWidth: '100%',
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
  modalContent: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 50,
    maxWidth: vars.maxScreenWidth,
    alignSelf: 'center',
    flex: 1,
  },
})

export default AcceptDocumentLayout
