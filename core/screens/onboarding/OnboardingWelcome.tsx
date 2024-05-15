import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import AlreadyHaveAccountText from '@holi/core/auth/components/AlreadyHaveAccountText'
import CenteredContentLayout from '@holi/core/components/CenteredContentLayout'
import HtmlDocument from '@holi/core/components/HtmlDocument'
import { DocType } from '@holi/core/documents/DocType'
import { HoliBadRequestError } from '@holi/core/errors/classes/HoliBadRequestError'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import { useDocumentURL } from '@holi/core/helpers/useDocumentURL'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { storeOnboardingState } from '@holi/core/screens/onboarding/hooks'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import Spacing from '@holi/ui/foundations/Spacing'

const SMALL_DEVICE_HEIGHT = 624

interface Props {
  headingText?: string
  onRegistration?: () => void
  onDismiss?: CallableFunction
}

const isWeb = Platform.OS === 'web'

const OnboardingWelcome = ({ headingText, onRegistration, onDismiss }: React.PropsWithChildren<Props>) => {
  const { t } = useTranslation()
  const { navigateBack, navigate, replaceRoute } = useRouting()
  headingText = headingText ?? t('profile.loggedOut.heading')
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()
  const { height: screenHeight } = useClientWindowDimensions()
  const { isLoggedIn } = useLoggedInUser()

  const [shownDocument, setShownDocument] = useState<DocType>('imprint')
  const documentUrl = useDocumentURL(shownDocument)

  const { show: showModal, hide: hideModal, props: modalProps } = useModalState({ visible: false })

  const showModalFor = (document: DocType) => {
    setShownDocument(document)
    showModal()
    // prevent HoliLink default behaviour
    return false
  }

  const onDocumentLoadError = (err?: Error) => {
    if (err instanceof HoliBadRequestError) {
      openToast(t('profile.settings.legalDocuments.error.notFound'), HoliToastType.ERROR)
    } else {
      displayError(err, 'Failed to load document', {
        location: 'OnboardingWelcome.onDocumentLoadError',
        document: shownDocument,
      })
    }
    hideModal()
  }

  useEffect(() => {
    if (isWeb && isLoggedIn) {
      replaceRoute('/')
    }
  }, [replaceRoute, isLoggedIn])

  const footerDocs: DocType[] = ['imprint', 'privacyPolicy', 'termsOfUse', 'openSource']

  const setScreenOptions = useSetScreenOptions()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ headerShown: false, navigationCustomOptions: { footerShown: false } })
  }, [setScreenOptions])

  const docsElement = (
    <View style={styles.bottomLinkContainer}>
      {footerDocs.map((docType) => (
        <HoliTextLink
          key={docType}
          label={t(`profile.loggedOut.footer.${docType}`)}
          onPress={() => showModalFor(docType)}
          href={`/profile/settings/legalDocuments/document?type=${docType}`}
          size="small"
          color="gray300"
        >
          {t(`profile.loggedOut.footer.${docType}`)}
        </HoliTextLink>
      ))}
      {Platform.OS !== 'web' && (
        <HoliTextLink
          label={t('profile.loggedOut.footer.aboutholiapp')}
          onPress={() => navigate('/profile/settings/aboutholiapp')}
          href={'/profile/settings/aboutholiapp'}
          size="small"
          color="gray300"
        >
          {t('profile.loggedOut.footer.aboutholiapp')}
        </HoliTextLink>
      )}
    </View>
  )

  return (
    <View style={styles.fillHeight}>
      <CenteredContentLayout append={docsElement}>
        <View style={styles.imageContainer}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/illustrations/illustration_join_holi.svg')}
            isSvg
            width={screenHeight <= SMALL_DEVICE_HEIGHT ? 180 : 251}
            height={screenHeight <= SMALL_DEVICE_HEIGHT ? 130 : 182}
            label={t('profile.loggedOut.image')}
          />
        </View>
        <HoliBox padding={[screenHeight <= SMALL_DEVICE_HEIGHT ? Spacing.md : Spacing['3xl'], 0, 0, 0]} />
        <HoliHeading level="1" size="m" align="center" testID="login-protection-heading">
          {headingText}
        </HoliHeading>

        <HoliButton
          label={t('auth.loginProtection.registrationLabel')}
          onPress={() => {
            onRegistration?.()
            navigate('/onboarding/registration')
          }}
          style={[styles.button, styles.firstButton]}
          testID="btn-to-registration-form"
        >
          {t('auth.loginProtection.registration')}
        </HoliButton>

        <HoliButton
          label={t('auth.loginProtection.continueAsGuest')}
          onPress={() => {
            storeOnboardingState('finished')
            onDismiss?.()
            navigateBack()
          }}
          style={[styles.button, styles.secondButton]}
          type="secondary"
          testID="btn-to-continue-as-guest"
        >
          {t('auth.loginProtection.continueAsGuest')}
        </HoliButton>

        <AlreadyHaveAccountText style={styles.loginHeadline} />
      </CenteredContentLayout>

      <HoliModal
        label={t(`profile.loggedOut.footer.${shownDocument}`)}
        heading={t(`profile.loggedOut.footer.${shownDocument}`)}
        {...modalProps}
        autoHeight={false}
        relativeHeight={1}
      >
        <HtmlDocument fallbackToWebView url={documentUrl} onError={onDocumentLoadError} />
      </HoliModal>
    </View>
  )
}

const styles = StyleSheet.create({
  fillHeight: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
  },
  button: {
    maxWidth: 300,
    alignSelf: 'center',
  },
  firstButton: {
    marginTop: 24,
  },
  secondButton: {
    marginTop: 16,
  },
  loginHeadline: {
    marginTop: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  bottomLinkContainer: {
    width: '100%',
    justifyContent: 'center',
    columnGap: Spacing['xxs'],
    rowGap: Spacing['4xs'],
    flexDirection: 'row',
    flexWrap: 'wrap',
    bottom: Spacing['xxs'],
    position: isWeb ? 'fixed' : 'absolute',
  },
})

export default OnboardingWelcome
