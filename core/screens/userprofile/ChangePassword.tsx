import { LoginFlow, SettingsFlow, UiNode } from '@ory/kratos-client'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  submitSettingsFlow,
} from '@holi/core/auth/helpers/auth'
import { getSettingsFlow } from '@holi/core/auth/helpers/auth/helpers.web'
import { findInputNodeByNameAndType, handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { useAuth } from '@holi/core/auth/helpers/useAuth'
import DefaultLayout from '@holi/core/components/DefaultLayout'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSafeDispatch } from '@holi/core/helpers'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export interface ChangePasswordProps {
  forgotPasswordFlow?: boolean
}

export type ChangePasswordParams = {
  flow: string
}

const { useParam } = createParam<ChangePasswordParams>()

const ChangePassword = ({ forgotPasswordFlow = false }: ChangePasswordProps) => {
  const [flow] = useParam('flow')
  const { t, i18n } = useTranslation()
  const [oldPwdNode, setOldPwdNode] = useState<UiNode>()
  const [newPwdNode, setNewPwdNode] = useState<UiNode>()
  const [oldPwd, setOldPwd] = useState<string>('')
  const [newPwd, setNewPwd] = useState<string>('')
  const [newPwdRetype, setNewPwdRetype] = useState<string>('')
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
        if (!forgotPasswordFlow) {
          initReauthFlow(session.session_token)
            .then(({ data: reauthFlow }) => safeSetReauthFlow(reauthFlow))
            .catch((error: Error) =>
              displayError(error, 'Failed to initialize reauth flow', { location: 'ChangePassword.initReauthFlow' })
            )
        }
        if (flow) {
          getSettingsFlow(flow, session.session_token)
            .then(({ data: settingsFlow }) => safeSetSettingsFlow(settingsFlow))
            .catch((error: Error) =>
              displayError(error, 'Failed to initialize settings flow', { location: 'ChangePassword.initSettingsFlow' })
            )
        } else {
          initSettingsFlow(session.session_token)
            .then(({ data: settingsFlow }) => safeSetSettingsFlow(settingsFlow))
            .catch((error: Error) =>
              displayError(error, 'Failed to initialize settings flow', { location: 'ChangePassword.initSettingsFlow' })
            )
        }
      }
    }
  }, [isLoggedIn, safeSetReauthFlow, safeSetSettingsFlow, displayError, forgotPasswordFlow, flow])

  useLayoutEffect(() => {
    setScreenOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="small">
          {t('auth.changePassword.heading')}
        </HoliHeading>
      ),
    })

    initForm()
  }, [initForm, setScreenOptions, t])

  const performPasswordChange = async () => {
    setRetypeError(undefined)
    if ((reauthFlow || forgotPasswordFlow) && settingsFlow) {
      if (forgotPasswordFlow && newPwdRetype !== newPwd) {
        setRetypeError(t('auth.changePassword.input.dont-match'))
        return
      }
      try {
        if (!forgotPasswordFlow && reauthFlow) {
          await submitReauthFlow(reauthFlow, oldPwd, sessionToken)
          setOldPwdNode(undefined)
        }
        try {
          await submitSettingsFlow(settingsFlow, newPwd, sessionToken)

          openToast(t('auth.changePassword.success'), HoliToastType.SUCCESS)
          navigate('/profile')
        } catch (err) {
          handleFormSubmitError(
            (flow) => {
              const passwordNode = findInputNodeByNameAndType('password', 'password', flow)
              setNewPwdNode(passwordNode)
            },
            initForm,
            (error) =>
              displayError(error, 'Failed to submit settings flow', {
                displayMessage: t('auth.changePassword.error'),
                location: 'ChangePassword.performPasswordChange',
              }),
            err
          )
        }
      } catch (err) {
        handleFormSubmitError(
          (flow) => {
            const passwordNode = findInputNodeByNameAndType('password', 'password', flow)
            // sometimes messages are no attached to the node but are transfered generally, so we move them to the node
            if (passwordNode && flow.ui.messages && !passwordNode.messages?.length) {
              passwordNode.messages = flow.ui.messages
            }
            setOldPwdNode(passwordNode)
          },
          initForm,
          (error) =>
            displayError(error, 'Failed to submit reauth flow', {
              displayMessage: t('auth.changePassword.error'),
              location: 'ChangePassword.performPasswordChange',
            }),
          err
        )
      }
    }
  }

  const handleKeyDown = (event: NativeSyntheticEvent<TextInputKeyPressEventData | TextInputProps>) => {
    const nativeElement = event.nativeEvent as TextInputKeyPressEventData
    if (nativeElement.key === 'Enter') {
      performPasswordChange()
    }
  }

  return (
    <DefaultLayout keyboardShouldPersistTaps="always" style={styles.layout}>
      <View style={[mixins.container, styles.formContainer]}>
        {!((forgotPasswordFlow || reauthFlow) && settingsFlow) ? (
          <HoliLoader />
        ) : (
          <>
            {!forgotPasswordFlow && (
              <HoliTextInput
                inputLabel={t('auth.changePassword.input.label-OldPassword')}
                aria-label={t('auth.changePassword.input.label-OldPassword')}
                placeholder={t('auth.changePassword.input.placeholder-OldPassword')}
                validationErrorText={oldPwdNode && getValidationErrorText(oldPwdNode, i18n)}
                inputProps={{ onKeyPress: handleKeyDown, autoFocus: true }}
                maxNoOfCharacters={200}
                onChange={setOldPwd}
                type="password"
                style={styles.formField}
                testID={'old-password'}
              />
            )}
            <HoliTextInput
              inputLabel={t('auth.changePassword.input.label-NewPassword')}
              aria-label={t('auth.changePassword.input.label-NewPassword')}
              placeholder={t('auth.changePassword.input.placeholder-NewPassword')}
              validationErrorText={retypeError ? retypeError : newPwdNode && getValidationErrorText(newPwdNode, i18n)}
              inputProps={{ onKeyPress: handleKeyDown, autoComplete: 'new-password' }}
              maxNoOfCharacters={200}
              onChange={setNewPwd}
              type="password"
              style={styles.formField}
              testID={'new-password'}
            />
            {!!forgotPasswordFlow && (
              <HoliTextInput
                inputLabel={t('auth.changePassword.input.label-NewPassword-retype')}
                aria-label={t('auth.changePassword.input.label-NewPassword-retype')}
                placeholder={t('auth.changePassword.input.placeholder-NewPassword-retype')}
                validationErrorText={retypeError ? retypeError : newPwdNode && getValidationErrorText(newPwdNode, i18n)}
                inputProps={{ onKeyPress: handleKeyDown, autoComplete: 'new-password' }}
                maxNoOfCharacters={200}
                onChange={setNewPwdRetype}
                type="password"
                style={styles.formField}
                testID={'new-password-retype'}
              />
            )}
            <HoliButton
              label={t('auth.changePassword.input.label-Save')}
              onPress={performPasswordChange}
              testID={'btn-submit-change-password'}
              style={styles.formButton}
            >
              {t('auth.changePassword.input.label-Save')}
            </HoliButton>
          </>
        )}
      </View>
    </DefaultLayout>
  )
}

export default ChangePassword

const styles = StyleSheet.create({
  layout: {
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
    paddingTop: +vars.topBarHeight,
    justifyContent: 'center',
  },
  formContainer: {
    maxWidth: +vars.maxButtonWidth,
    paddingBottom: +vars.topBarHeight,
  },
  formField: {
    marginTop: 10,
  },
  formButton: {
    marginTop: 30,
  },
})
