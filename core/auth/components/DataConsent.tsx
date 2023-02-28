import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Trans } from 'react-i18next'
import { Platform, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliModal, { useModalState } from '@holi//ui/components/molecules/HoliModal'
import CenteredContentLayout from '@holi/core/components/CenteredContentLayout'
import DataConsentDocument from '@holi/core/screens/dataConsent/DataConsentDocument'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
import HoliLink from '@holi/ui/components/molecules/HoliLink'
import HoliWizardNaviagtionButtons, {
  BUTTON_RECTS,
} from '@holi/ui/components/organisms/HoliWizard/HoliWizardNaviagtionButtons'
import { colors } from '@holi/ui/styles/globalVars'
import { vars } from '@holi/ui/styles/globalVars'
import { useTheme } from '@holi/ui/styles/theme'

interface DataConsentProps {
  onNextPress?: () => void
  onBackPress?: () => void
  style?: StyleProp<ViewStyle>
}

const DataConsent = ({ onNextPress, onBackPress, style }: React.PropsWithChildren<DataConsentProps>) => {
  const { t } = useTranslation()
  const [accepted, setAccepted] = useState(false)
  const { show: showModal, props: modalProps } = useModalState()
  const { theme } = useTheme()

  const navButtons = (
    <HoliWizardNaviagtionButtons
      onNextPress={onNextPress}
      onBackPress={onBackPress}
      isNextButtonEnabled={accepted}
      style={styles.buttonContainer}
    />
  )

  return (
    <CenteredContentLayout append={navButtons} style={style} contentContainerStyle={styles.outerContentContainerStyle}>
      <View style={styles.inner}>
        <View>
          <View style={styles.imageContainer}>
            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/illustrations/onboarding_consent_data.svg')}
              isSvg
              width={251}
              height={181}
              label={t('profile.loggedOut.image')}
            />
          </View>

          <HoliHeading level="1" size="medium" style={styles.headline} testID="login-protection-heading">
            {t('onboarding.dataconsent.heading')}
          </HoliHeading>

          <HoliText style={styles.description}>{t('onboarding.dataconsent.describtion')}</HoliText>
        </View>

        <HoliCheckbox
          autofocus={false}
          checked={accepted}
          onSelect={() => setAccepted((value) => !value)}
          style={styles.checkbox}
        >
          <View>
            <HoliText size="small">
              <Trans t={t} i18nKey={'onboarding.dataconsent.checkboxLabel'}>
                <HoliLink
                  label=""
                  href={'/communityGuidelines'}
                  onPress={() => {
                    showModal()
                    return false
                  }}
                  textStyle={[styles.labelLink, { fontFamily: theme.fontFamily.default('Medium') }]}
                />
              </Trans>
            </HoliText>
          </View>
        </HoliCheckbox>

        {/* TODO: use correct label */}
        <HoliModal
          label={t('auth.login.checkbox.label-Consent')}
          {...modalProps}
          autoHeight={false}
          relativeHeight={1}
          style={styles.modal}
        >
          <ScrollView style={styles.modalContent} contentContainerStyle={{ maxWidth: '100%' }}>
            <DataConsentDocument />
          </ScrollView>
        </HoliModal>
      </View>
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
    fontWeight: 400,
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

export default DataConsent
