import { LoginFlow, SettingsFlow, UiNode } from '@ory/kratos-client'
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import {
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  TextInputKeyPressEventData,
  TextInputProps,
  View,
} from 'react-native'

import { getValidationErrorText } from '@holi/core/auth/components/FormInputField'
import {
  getSessionFromStorage,
  initReauthFlow,
  initSettingsFlow,
  submitReauthFlow,
  submitSettingsFlowProfile,
} from '@holi/core/auth/helpers/auth'
import { findInputNodeByNameAndType, handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { useAuth } from '@holi/core/auth/helpers/useAuth'
import DefaultLayout from '@holi/core/components/DefaultLayout'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSafeDispatch } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const ChangeEmail = () => {
  const { t, i18n } = useTranslation()
  const [oldPwdNode, setOldPwdNode] = useState<UiNode>()
  const [newEmailNode, setNewEmailNode] = useState<UiNode>()
  const [oldPwd, setOldPwd] = useState<string>('')
  const [newEmail, setNewEmail] = useState<string>('')
  const [newEmailRetype, setNewEmailRetype] = useState<string>('')
  const [retypeError, setRetypeError] = useState<string>()
  const { isLoggedIn } = useAuth()
  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()
  const mixins = useStyleMixins()

  const [settingsFlow, setSettingsFlow] = useState<SettingsFlow>()
  const [reauthFlow, setReauthFlow] = useState<LoginFlow>()
  const [sessionToken, setSessionToken] = useState<string>()
  const safeSetSettingsFlow = useSafeDispatch(setSettingsFlow)
  const safeSetReauthFlow = useSafeDispatch(setReauthFlow)

  const initForm = useCallback(async () => {
    if (isLoggedIn) {
      const session = await getSessionFromStorage()
      if (session) {
        setSessionToken(session.session_token)
        // we are in a normal change Email dialog, so we start a new reauth flow
        // reauth is needed, because setting sensitive information needs a new reauth
        initReauthFlow(session.session_token)
          .then(({ data: reauthFlow }) => safeSetReauthFlow(reauthFlow))
          .catch((error: Error) =>
            displayError(error, 'Failed to initialize reauth flow', { location: 'ChangeEmail.initReauthFlow' })
          )
        initSettingsFlow(session.session_token)
          .then(({ data: settingsFlow }) => safeSetSettingsFlow(settingsFlow))
          .catch((error: Error) =>
            displayError(error, 'Failed to initialize settings flow', { location: 'ChangeEmail.initSettingsFlow' })
          )
      }
    }
  }, [isLoggedIn, safeSetReauthFlow, displayError, safeSetSettingsFlow])

  useLayoutEffect(() => {
    setScreenOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="small">
          {t('auth.changeEmail.heading')}
        </HoliHeading>
      ),
    })
  }, [setScreenOptions, t])

  useEffect(() => {
    if (isLoggedIn) {
      initForm()
    }
  }, [initForm, isLoggedIn])

  const performEmailChange = async () => {
    setRetypeError(undefined)
    if (!reauthFlow || !settingsFlow) return

    if (newEmailRetype !== newEmail) {
      setRetypeError(t('auth.changeEmail.input.dont-match'))
      return
    }
    if (reauthFlow) {
      try {
        await submitReauthFlow(reauthFlow, oldPwd, sessionToken)
        setOldPwdNode(undefined)
      } catch (err) {
        handleFormSubmitError(
          (flow) => {
            const passwordNode = findInputNodeByNameAndType('password', 'password', flow)
            // sometimes messages are not attached to the node but are transferred generally, so we move them to the node
            if (passwordNode && flow.ui.messages && !passwordNode.messages?.length) {
              passwordNode.messages = flow.ui.messages
            }
            setOldPwdNode(passwordNode)
          },
          initForm,
          (error) =>
            displayError(error, 'Failed to submit reauth flow', {
              displayMessage: t('auth.changeEmail.error'),
              location: 'ChangeEmail.performEmailChange',
            }),
          err
        )
        return // do not submit the settings flow, when the reauth didn't work
      }
    }
    try {
      const traits = { ...settingsFlow.identity.traits, email: newEmail }
      await submitSettingsFlowProfile(settingsFlow, traits, sessionToken)

      openToast(t('auth.changeEmail.success'), HoliToastType.SUCCESS)
      navigate('/profile')
    } catch (err) {
      handleFormSubmitError(
        (flow) => {
          const emailNode = findInputNodeByNameAndType('traits.email', 'email', flow)
          setNewEmailNode(emailNode)
        },
        initForm,
        (error) =>
          displayError(error, 'Failed to submit settings flow', {
            displayMessage: t('auth.changeEmail.error'),
            location: 'ChangeEmail.performEmailChange',
          }),
        err
      )
    }
  }

  const handleKeyDown = (event: NativeSyntheticEvent<TextInputKeyPressEventData | TextInputProps>) => {
    const nativeElement = event.nativeEvent as TextInputKeyPressEventData
    if (nativeElement.key === 'Enter') {
      performEmailChange()
    }
  }

  const email = settingsFlow
    ? findInputNodeByNameAndType('traits.email', 'email', settingsFlow)?.attributes?.value
    : '...'

  return (
    <DefaultLayout keyboardShouldPersistTaps="always" style={styles.layout}>
      <View style={[mixins.container, styles.formContainer]}>
        {!(reauthFlow && settingsFlow) ? (
          <HoliLoader />
        ) : (
          <>
            <HoliText>
              <Trans t={t} i18nKey="auth.changeEmail.description" values={{ email }}>
                <HoliText bold />
              </Trans>
            </HoliText>
            <View style={styles.inputFieldsContainer}>
              <HoliTextInput
                inputLabel={t('auth.changeEmail.input.label-OldPassword')}
                aria-label={t('auth.changeEmail.input.label-OldPassword')}
                placeholder={t('auth.changeEmail.input.placeholder-OldPassword')}
                validationErrorText={oldPwdNode && getValidationErrorText(oldPwdNode, i18n)}
                inputProps={{ onKeyPress: handleKeyDown, autoFocus: true, autoComplete: 'password' }}
                maxNoOfCharacters={200}
                onChange={setOldPwd}
                type="password"
                testID={'old-password'}
              />
              <HoliTextInput
                inputLabel={t('auth.changeEmail.input.label-NewEmail')}
                aria-label={t('auth.changeEmail.input.label-NewEmail')}
                placeholder={t('auth.changeEmail.input.placeholder-NewEmail')}
                validationErrorText={
                  retypeError ? retypeError : newEmailNode && getValidationErrorText(newEmailNode, i18n)
                }
                inputProps={{ onKeyPress: handleKeyDown, autoComplete: 'email' }}
                maxNoOfCharacters={200}
                onChange={setNewEmail}
                type="email"
                testID={'new-email'}
              />
              <HoliTextInput
                inputLabel={t('auth.changeEmail.input.label-NewEmail-retype')}
                aria-label={t('auth.changeEmail.input.label-NewEmail-retype')}
                placeholder={t('auth.changeEmail.input.placeholder-NewEmail-retype')}
                validationErrorText={
                  retypeError ? retypeError : newEmailNode && getValidationErrorText(newEmailNode, i18n)
                }
                inputProps={{ onKeyPress: handleKeyDown, autoComplete: 'email' }}
                maxNoOfCharacters={200}
                onChange={setNewEmailRetype}
                type="email"
                testID={'new-email-retype'}
              />
            </View>
            <HoliButtonLoading
              label={t('auth.changeEmail.input.label-Save')}
              onPress={performEmailChange}
              testID={'btn-submit-change-email'}
            >
              {t('auth.changeEmail.input.label-Save')}
            </HoliButtonLoading>
          </>
        )}
      </View>
    </DefaultLayout>
  )
}

export default ChangeEmail

const styles = StyleSheet.create({
  layout: {
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
  },
  formContainer: {
    maxWidth: +vars.maxButtonWidth,
    paddingTop: 16,
  },
  inputFieldsContainer: {
    paddingTop: 24,
    gap: 16,
    paddingBottom: 24,
  },
})
