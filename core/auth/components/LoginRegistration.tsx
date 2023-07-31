import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import AlreadyHaveAccountText from '@holi/core/auth/components/AlreadyHaveAccountText'
import CenteredContentLayout from '@holi/core/components/CenteredContentLayout'
import HtmlDocument from '@holi/core/components/HtmlDocument'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
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
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { DocType } from '@holi/web/pages/api/documents'

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
  const mixins = useStyleMixins()
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()

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
      displayError(err, t('global.technicalError'))
    }
    hideModal()
  }

  return (
    <View style={styles.fillHeight}>
      <View style={styles.fillHeight}>
        <CenteredContentLayout>
          <View>
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
          </View>

          <HoliButton
            label={t('auth.loginProtection.registrationLabel')}
            onPress={onRegistration}
            style={[styles.button, styles.fistButton]}
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
      </View>

      <View style={styles.bottomLinkContainer}>
        <HoliText size={'small'} color="gray300">
          <HoliTextLink
            label={t('profile.loggedOut.footer.imprint')}
            onPress={() => showModalFor('imprint')}
            href={'/profile'}
            variant="inline"
          >
            {t('profile.loggedOut.footer.imprint')}
          </HoliTextLink>
        </HoliText>

        <HoliText size={'small'} color="gray300">
          <HoliTextLink
            label={t('profile.loggedOut.footer.privacyPolicy')}
            onPress={() => showModalFor('privacyPolicy')}
            href={'/profile'}
            variant="inline"
          >
            {t('profile.loggedOut.footer.privacyPolicy')}
          </HoliTextLink>
        </HoliText>

        <HoliModal
          label={t(`profile.loggedOut.footer.${shownDocument}`)}
          heading={t(`profile.loggedOut.footer.${shownDocument}`)}
          {...modalProps}
          autoHeight={false}
          relativeHeight={1}
        >
          <ScrollHeaderLayout.Default
            style={mixins.container}
            contentContainerStyle={{ maxWidth: '100%' }}
            headerOverlap
          >
            <HtmlDocument url={getDocumentURL(shownDocument)} onError={onDocumentLoadError} />
          </ScrollHeaderLayout.Default>
        </HoliModal>
      </View>
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
  text: {
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 74,
  },
  button: {
    maxWidth: 300,
    alignSelf: 'center',
  },
  fistButton: {
    marginTop: 24,
  },
  secondButton: {
    marginTop: 16,
  },
  loginHeadline: {
    marginTop: 16,
    textAlign: 'center',
  },
  bottomLinkContainer: {
    width: '100%',
    justifyContent: 'center',
    gap: 6,
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 24,
  },
})

export default LoginRegistration
