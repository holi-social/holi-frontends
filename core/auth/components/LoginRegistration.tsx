import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import AlreadyHaveAccountText from '@holi/core/auth/components/AlreadyHaveAccountText'
import CenteredContentLayout from '@holi/core/components/CenteredContentLayout'
import HtmlDocument from '@holi/core/components/HtmlDocument'
import { HoliBadRequestError } from '@holi/core/errors/classes/HoliBadRequestError'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { getDocumentURL } from '@holi/core/helpers'
import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
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
  const { height: screenHeight } = useClientWindowDimensions()

  const [shownDocument, setShownDocument] = useState<DocType>('imprint')

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
            width={251}
            height={181}
            label={t('profile.loggedOut.image')}
          />
        </View>
        <HoliBox padding={[screenHeight <= SMALL_DEVICE_HEIGHT ? 24 : 74, 0, 0, 0]} />
        <HoliHeading level="1" size="m" align="center" testID="login-protection-heading">
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
    gap: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    bottom: 24,
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
  },
})

export default LoginRegistration
