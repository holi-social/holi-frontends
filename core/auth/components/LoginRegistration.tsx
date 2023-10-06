import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import AlreadyHaveAccountText from '@holi/core/auth/components/AlreadyHaveAccountText'
import CenteredContentLayout from '@holi/core/components/CenteredContentLayout'
import HtmlDocument from '@holi/core/components/HtmlDocument'
import { HoliBadRequestError } from '@holi/core/errors/classes/HoliBadRequestError'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { getDocumentURL } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextLink from '@holi/ui/components/atoms/HoliTextLink'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { DocType } from '@holi/web/pages/api/documents'

const SMALL_DEVICE_HEIGHT = 624

interface LoginRegistrationProps {
  headingText?: string
  onRegistration?: () => void
  onDismiss?: CallableFunction
}

const LoginRegistration = ({
  headingText,
  onRegistration,
  onDismiss,
}: React.PropsWithChildren<LoginRegistrationProps>) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  headingText = headingText ?? t('profile.loggedOut.heading')
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()
  const { height: screenHeight } = useWindowDimensions()
  const styles = getStyles(screenHeight)

  const [shownDocument, setShownDocument] = useState<DocType>('imprint')

  const { show: showModal, hide: hideModal, props: modalProps } = useModalState({ visible: false })

  const showModalFor = (document: DocType) => {
    setShownDocument(document)
    showModal()
  }

  const onDocumentLoadError = (err?: Error) => {
    if (err instanceof HoliBadRequestError) {
      openToast(t('profile.settings.legalDocuments.error.notFound'), HoliToastType.ERROR)
    } else {
      displayError(err, 'Failed to load document', {
        location: 'LoginRegistration.onDocumentLoadError',
        document: shownDocument,
      })
    }
    hideModal()
  }

  const footerDocs: DocType[] = ['imprint', 'privacyPolicy', 'openSource']

  const docsElement = (
    <View style={styles.bottomLinkContainer}>
      {footerDocs.map((docType) => (
        <HoliText size={'small'} color="gray300" key={docType}>
          <HoliTextLink
            label={t(`profile.loggedOut.footer.${docType}`)}
            onPress={() => showModalFor(docType)}
            href={'/profile'}
            variant="inline"
          >
            {t(`profile.loggedOut.footer.${docType}`)}
          </HoliTextLink>
        </HoliText>
      ))}
    </View>
  )

  return (
    <View style={styles.fillHeight}>
      <CenteredContentLayout append={docsElement}>
        <View style={styles.imageContainer}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/illustrations/illustration_join_holi.svg')}
            isSvg
            width={251}
            height={181}
            label={t('profile.loggedOut.image')}
          />
        </View>
        <HoliHeading level="1" size="medium" style={styles.text} testID="login-protection-heading">
          {headingText}
        </HoliHeading>

        <HoliButton
          label={t('auth.loginProtection.registrationLabel')}
          onPress={onRegistration}
          style={[styles.button, styles.firstButton]}
          testID="btn-to-registration-form"
        >
          {t('auth.loginProtection.registration')}
        </HoliButton>

        <HoliButton
          label={t('auth.loginProtection.continueAsGuest')}
          onPress={() => {
            onDismiss?.()
            navigate('/')
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
        <HtmlDocument fallbackToWebView url={getDocumentURL(shownDocument)} onError={onDocumentLoadError} />
      </HoliModal>
    </View>
  )
}

const getStyles = (screenHeight: number) =>
  StyleSheet.create({
    fillHeight: {
      flex: 1,
    },
    imageContainer: {
      alignItems: 'center',
    },
    text: {
      fontWeight: '400',
      textAlign: 'center',
      marginTop: screenHeight <= SMALL_DEVICE_HEIGHT ? 24 : 74,
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
      gap: 6,
      flexDirection: 'row',
      bottom: 24,
      position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    },
  })

export default LoginRegistration
