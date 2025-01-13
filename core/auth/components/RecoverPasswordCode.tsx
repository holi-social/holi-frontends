import type { RecoveryFlow } from '@ory/kratos-client'
import type { AxiosError } from 'axios'
import { TextLink } from 'holi-bricks/components/text'
import React, { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type ScrollView, StyleSheet } from 'react-native'

import CenteredImageHeadlineDescriptionLayout from '@holi/core/auth/components/CenteredImageHeadlineDescriptionLayout'
import { updatePasswordRecoveryFlowCode, updatePasswordRecoveryFlowEmail } from '@holi/core/auth/helpers/auth'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import { useScrollToInputOnFocus } from '@holi/ui/helper/useScrollToInputOnFocus'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

const CODE_MAX_COUNT = 6

const isAxiosError = (err: AxiosError | unknown): err is AxiosError => {
  return !!(err as AxiosError).response
}

export type RecoverPasswordCodeProps = {
  email: string
  flow?: RecoveryFlow
  webview: boolean
  onDismiss?: () => void
  onSuccess?: () => void
}

const RecoverPasswordCode = ({ email, flow, webview }: RecoverPasswordCodeProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()

  const [code, setCode] = useState('')
  const scrollViewRef = useRef<ScrollView>(null)
  const scrollToInputWithId = useScrollToInputOnFocus(scrollViewRef)
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const resendEmail = async () => {
    if (!flow) return false

    try {
      await updatePasswordRecoveryFlowEmail(flow, email)
      openToast(t('auth.forgotPassword.message.emailResent'), HoliToastType.SUCCESS)
    } catch (error) {
      displayError(error, 'Failed to resend email for password recovery', {
        displayMessage: t('auth.forgotPassword.message.emailResent.error'),
        location: 'RecoverPasswordCode.resendEmail',
      })
    }

    // prevent HoliTextLink default behaviour
    return false
  }

  const trimPrefix = (prefix: string, str: string) => {
    if (str.startsWith(prefix)) {
      return str.slice(prefix.length)
    }
    return str
  }

  const submitCode = async () => {
    if (!flow) return false

    try {
      const {
        data: {
          ui: { messages },
          state,
        },
      } = await updatePasswordRecoveryFlowCode(flow, code)
      if (state === 'sent_email' && messages?.length) {
        openToast(t('auth.forgotPassword.message.submitCode.error'), HoliToastType.ERROR)
        setCode('')
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const responseData = error.response?.data as { error?: { id: string }; redirect_browser_to?: string }
        if (
          error.response?.status === 422 &&
          responseData?.error?.id === 'browser_location_change_required' &&
          responseData?.redirect_browser_to
        ) {
          const url = trimPrefix('/api/.ory', responseData?.redirect_browser_to)
          navigate(webview ? url + '&webview=true' : url)
        } else {
          displayError(error, 'Failed to recover with code for password recovery', {
            displayMessage: t('auth.forgotPassword.message.submitCode.error'),
            location: 'RecoverPasswordCode.submitCode.axisError',
          })
        }
      } else {
        displayError(error, 'Failed to recover with code for password recovery', {
          displayMessage: t('auth.forgotPassword.message.submitCode.error'),
          location: 'RecoverPasswordCode.submitCode',
        })
      }
    }

    // prevent HoliTextLink default behaviour
    return false
  }

  if (!flow) return null

  return (
    <HoliKeyboardSaveView>
      <CenteredImageHeadlineDescriptionLayout
        imageSource={require('@holi/ui/assets/img/illustrations/registration_email_verification.svg')}
        imageLabelText={t('auth.forgotPassword.image-label')}
        headlineText={t('auth.forgotPassword.heading')}
        descriptionText={t('auth.forgotPassword.description')}
        testID="email-verification"
        ref={scrollViewRef}
        contentStyle={styles.inner}
      >
        <HoliBox padding={[32, 0, 0, 0]} layout={styles.limitedBox} />
        <HoliTextInput
          value={code}
          onChange={setCode}
          placeholder={t('registration.emailVerification.inputPlaceholder')}
          aria-label={t('auth.forgotPassword.inputLabel')}
          maxNoOfCharacters={CODE_MAX_COUNT}
          showCharacterCount
          inputProps={{
            keyboardType: 'number-pad',
            inputMode: 'decimal',
            autoComplete: 'one-time-code',
          }}
          style={[styles.limitedBox, { alignSelf: 'center' }]}
          testID="email-verification-code"
          {...scrollToInputWithId('code')}
        />

        <HoliBox padding={[16, 0, 0, 0]}>
          <TextLink onPress={resendEmail} size="sm" role="link">
            {t('registration.emailVerification.resendEmail')}
          </TextLink>
        </HoliBox>

        <HoliBox padding={[24, 0, 0, 0]} layout={styles.limitedBox}>
          <HoliButtonLoading
            label={t('auth.forgotPassword.message.submitCode')}
            disabled={code.length !== CODE_MAX_COUNT}
            onPress={submitCode}
            type="primary"
            testID="btn-submit-code"
          >
            {t('auth.forgotPassword.message.submitCode')}
          </HoliButtonLoading>
        </HoliBox>

        {/* {isLoaderShown && <HoliLoader />} */}
      </CenteredImageHeadlineDescriptionLayout>
    </HoliKeyboardSaveView>
  )
}

export default RecoverPasswordCode

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    inner: {
      alignItems: 'center',
      width: '100%',
    },
    imageContainer: {
      alignItems: 'center',
    },
    headline: {
      fontWeight: '400',
      textAlign: 'center',
      marginTop: 64,
    },
    description: {
      color: theme.colors.foreground20,
      marginTop: 16,
      textAlign: 'center',
    },
    limitedBox: {
      width: '100%',
    },
  })
