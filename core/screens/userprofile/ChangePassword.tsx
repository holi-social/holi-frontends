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

import DefaultLayout from '@holi/core/DefaultLayout'
import { getValidationErrorText } from '@holi/core/auth/components/FormInputField'
import {
  getSessionFromStorage,
  initReauthFlow,
  initSettingsFlow,
  submitReauthFlow,
  submitSettingsFlow,
} from '@holi/core/auth/helpers/auth'
import { findInputNodeByNameAndType, handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSafeDispatch } from '@holi/core/helpers'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const ChangePassword = () => {
  const { t, i18n } = useTranslation()
  const [oldPwdNode, setOldPwdNode] = useState<UiNode>()
  const [newPwdNode, setNewPwdNode] = useState<UiNode>()
  const [oldPwd, setOldPwd] = useState<string>('')
  const [newPwd, setNewPwd] = useState<string>('')
  const { isLoggedIn } = useLoggedInUser()
  const { setOptions, navigate } = useUnifiedNavigation()
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
        initReauthFlow(session.session_token)
          .then(({ data: reauthFlow }) => safeSetReauthFlow(reauthFlow))
          .catch((error: Error) => displayError(error, '## Retrieve reauth flow ##'))
        initSettingsFlow(session.session_token)
          .then(({ data: settingsFlow }) => safeSetSettingsFlow(settingsFlow))
          .catch((error: Error) => displayError(error, '## Retrieve settings flow ##'))
      }
    }
  }, [isLoggedIn, safeSetReauthFlow, safeSetSettingsFlow, displayError])

  useLayoutEffect(() => {
    setOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="small">
          {t('auth.changePassword.heading')}
        </HoliHeading>
      ),
    })

    initForm()
  }, [setOptions, initForm, t])

  const performPasswordChange = async () => {
    if (reauthFlow && settingsFlow) {
      try {
        await submitReauthFlow(reauthFlow, oldPwd, sessionToken)
        setOldPwdNode(undefined)

        try {
          await submitSettingsFlow(settingsFlow, newPwd, sessionToken)

          openToast(t('auth.changePassword.success'), HoliToastType.SUCCESS, 4000)
          navigate('/profile')
        } catch (err) {
          handleFormSubmitError(
            (flow) => {
              const passwordNode = findInputNodeByNameAndType('password', 'password', flow)
              setNewPwdNode(passwordNode)
            },
            initForm,
            (error) => displayError(error, t('auth.changePassword.error')),
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
          (error) => displayError(error, t('auth.changePassword.error')),
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
        {!(reauthFlow && settingsFlow) ? (
          <HoliLoader />
        ) : (
          <>
            <HoliTextInput
              inputLabel={t('auth.changePassword.input.label-OldPassword')}
              accessibilityLabel={t('auth.changePassword.input.label-OldPassword')}
              placeholder={t('auth.changePassword.input.placeholder-OldPassword')}
              validationErrorText={oldPwdNode && getValidationErrorText(oldPwdNode, i18n)}
              inputProps={{ onKeyPress: handleKeyDown, autoFocus: true }}
              maxNoOfCharacters={200}
              onChange={setOldPwd}
              type="password"
              style={styles.formField}
              testID={'old-password'}
            />
            <HoliTextInput
              inputLabel={t('auth.changePassword.input.label-NewPassword')}
              accessibilityLabel={t('auth.changePassword.input.label-NewPassword')}
              placeholder={t('auth.changePassword.input.placeholder-NewPassword')}
              validationErrorText={newPwdNode && getValidationErrorText(newPwdNode, i18n)}
              inputProps={{ onKeyPress: handleKeyDown, autocomplete: 'new-password' }}
              maxNoOfCharacters={200}
              onChange={setNewPwd}
              type="password"
              style={styles.formField}
              testID={'new-password'}
            />
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
    paddingTop: vars.topBarHeight,
    justifyContent: 'center',
  },
  formContainer: {
    maxWidth: vars.maxButtonWidth,
    paddingBottom: vars.topBarHeight,
  },
  formField: {
    marginTop: 10,
  },
  formButton: {
    marginTop: 30,
  },
})
