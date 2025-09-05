import type { LoginFlow, SettingsFlow, UiNode } from '@ory/kratos-client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import {
  type NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  type TextInputKeyPressEventData,
  type TextInputProps,
  View,
} from 'react-native'

import { getValidationErrorText } from '@holi/core/auth/components/FormInputField'
import {
  getIdentity,
  getOidcProvider,
  getSessionFromStorage,
  initReauthFlow,
  initSettingsFlow,
  isOidcUser,
  submitReauthFlow,
  submitSettingsFlow,
} from '@holi/core/auth/helpers/auth'
import { getSettingsFlow, syncUserSessionFromOrySession } from '@holi/core/auth/helpers/auth/helpers'
import { findInputNodeByNameAndType, handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { setLoginStateLoggedIn, useLoginState } from '@holi/core/auth/loginState'
import KeyboardAvoidingViewWrapper from '@holi/core/components/KeyboardAvoidingViewWrapper'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSafeDispatch } from '@holi/core/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { Button } from 'holi-bricks/components/button'
import { Text } from 'holi-bricks/components/text'

export interface ChangePasswordProps {
  forgotPasswordFlow?: boolean
}

export type ChangePasswordParams = {
  flow: string
  webview: string
}

const { useParam } = createParamHooks<ChangePasswordParams>()

const ChangePassword = ({ forgotPasswordFlow = false }: ChangePasswordProps) => {
  const [flow] = useParam('flow')
  const [webview] = useParam('webview')
  const { t, i18n } = useTranslation()
  const [oldPwdNode, setOldPwdNode] = useState<UiNode>()
  const [newPwdNode, setNewPwdNode] = useState<UiNode>()
  const [oldPwd, setOldPwd] = useState<string>('')
  const [newPwd, setNewPwd] = useState<string>('')
  const [newPwdRetype, setNewPwdRetype] = useState<string>('')
  const [retypeError, setRetypeError] = useState<string>()
  const { isLoggedIn } = useLoginState()
  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()
  const mixins = useStyleMixins()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const [settingsFlow, setSettingsFlow] = useState<SettingsFlow>()
  const [reauthFlow, setReauthFlow] = useState<LoginFlow>()
  const [sessionToken, setSessionToken] = useState<string>()
  const [isOidc, setIsOidc] = useState<boolean | undefined>()
  const safeSetSettingsFlow = useSafeDispatch(setSettingsFlow)
  const safeSetReauthFlow = useSafeDispatch(setReauthFlow)
  const safeSetIsOidc = useSafeDispatch(setIsOidc)

  const initForm = useCallback(async () => {
    if (isLoggedIn) {
      const session = await getSessionFromStorage()
      if (session) {
        setSessionToken(session.session_token)
        if (!forgotPasswordFlow) {
          // we are in a normale change password dialog, so we start a new reauth flow
          // reauth is needed, because setting sensitive information needs a new reauth
          initReauthFlow(session.session_token)
            .then(({ data: reauthFlow }) => {
              safeSetIsOidc(isOidcUser(reauthFlow))
              safeSetReauthFlow(reauthFlow)
            })
            .catch((error: Error) =>
              displayError(error, 'Failed to initialize reauth flow', { location: 'ChangePassword.initReauthFlow' })
            )
        } else {
          safeSetIsOidc(false)
        }
        if (forgotPasswordFlow && flow) {
          // we are in a forgot password recovery flow, where the flow Id was passed as parameter
          // we just authentiated, so we don't need a reauth. We are getting the existing flow object from Ory to continue
          getSettingsFlow(flow, session.session_token)
            .then(({ data: settingsFlow }) => safeSetSettingsFlow(settingsFlow))
            .catch((error: Error) =>
              displayError(error, 'Failed to initialize settings flow', { location: 'ChangePassword.getSettingsFlow' })
            )
        } else {
          // fallback to initialize a settings flow
          initSettingsFlow(session.session_token)
            .then(({ data: settingsFlow }) => safeSetSettingsFlow(settingsFlow))
            .catch((error: Error) =>
              displayError(error, 'Failed to initialize settings flow', { location: 'ChangePassword.initSettingsFlow' })
            )
        }
      }
    }
  }, [isLoggedIn, safeSetReauthFlow, safeSetSettingsFlow, displayError, forgotPasswordFlow, flow, safeSetIsOidc])

  useIsomorphicLayoutEffect(() => {
    if (webview)
      setScreenOptions({
        headerLeft: () => <View />,
        headerRight: () => null,
        navigationCustomOptions: {
          footerShown: false,
        },
      })
    else
      setScreenOptions({
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerBackButtonMenuEnabled: true,
        headerTitle: () => (
          <HoliHeading level="1" size="s">
            {t('auth.changePassword.heading')}
          </HoliHeading>
        ),
        navigationCustomOptions: {
          footerShown: !forgotPasswordFlow,
        },
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forgotPasswordFlow, webview])

  useEffect(() => {
    if (isLoggedIn) {
      initForm()
    } else if (flow) {
      syncUserSessionFromOrySession().then((session) => {
        if (session) setLoginStateLoggedIn(session)
      })
    }
  }, [initForm, isLoggedIn, flow])

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
          if (webview) navigate('/profile/settings/changePasswordDone')
          else navigate('/profile')
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
    <KeyboardAvoidingViewWrapper
      style={{ backgroundColor: theme.colors.background20, flex: 1 }}
      renderProp={() => (
        <ScrollView keyboardShouldPersistTaps="handled" style={{ backgroundColor: theme.colors.background20, flex: 1 }}>
          <View style={[mixins.container, styles.inner]}>
            <HoliBox padding={[24, 0, 0, 0]}>
              {isOidc == undefined || !((forgotPasswordFlow || reauthFlow) && settingsFlow) ? (
                <HoliBox padding={16}>
                  <HoliLoader />
                </HoliBox>
              ) : (
                <>
                  {isOidc && reauthFlow ? (
                    <HoliBox padding={16}>
                      <Text textAlign="center">
                        <Trans
                          t={t}
                          i18nKey="auth.changePassword.oidc"
                          values={{
                            provider: getOidcProvider(reauthFlow),
                            identity: getIdentity(reauthFlow),
                          }}
                        >
                          <Text size="lg" />
                        </Trans>
                      </Text>
                    </HoliBox>
                  ) : (
                    <>
                      <Text>
                        {t(
                          forgotPasswordFlow
                            ? 'auth.changePassword.description-forgotflow'
                            : 'auth.changePassword.description'
                        )}
                      </Text>
                      <View style={styles.inputFieldsContainer}>
                        {!forgotPasswordFlow && (
                          <HoliTextInput
                            inputLabel={t('auth.changePassword.input.label-OldPassword')}
                            aria-label={t('auth.changePassword.input.label-OldPassword')}
                            placeholder={t('auth.changePassword.input.placeholder-OldPassword')}
                            validationErrorText={oldPwdNode && getValidationErrorText(oldPwdNode, i18n)}
                            inputProps={{ onKeyPress: handleKeyDown, autoFocus: true }}
                            maxNoOfCharacters={200}
                            onChange={setOldPwd}
                            value={oldPwd}
                            type="password"
                            testID={'old-password'}
                          />
                        )}
                        <HoliTextInput
                          inputLabel={t('auth.changePassword.input.label-NewPassword')}
                          aria-label={t('auth.changePassword.input.label-NewPassword')}
                          placeholder={t('auth.changePassword.input.placeholder-NewPassword')}
                          validationErrorText={
                            retypeError ? retypeError : newPwdNode && getValidationErrorText(newPwdNode, i18n)
                          }
                          helperText={t('auth.changePassword.input.helper-NewPassword')}
                          inputProps={{ onKeyPress: handleKeyDown, autoComplete: 'new-password' }}
                          maxNoOfCharacters={200}
                          onChange={setNewPwd}
                          value={newPwd}
                          type="password"
                          testID={'new-password'}
                        />
                        {!!forgotPasswordFlow && (
                          <HoliTextInput
                            inputLabel={t('auth.changePassword.input.label-NewPassword-retype')}
                            aria-label={t('auth.changePassword.input.label-NewPassword-retype')}
                            placeholder={t('auth.changePassword.input.placeholder-NewPassword-retype')}
                            validationErrorText={
                              retypeError ? retypeError : newPwdNode && getValidationErrorText(newPwdNode, i18n)
                            }
                            inputProps={{ onKeyPress: handleKeyDown, autoComplete: 'new-password' }}
                            maxNoOfCharacters={200}
                            onChange={setNewPwdRetype}
                            value={newPwdRetype}
                            type="password"
                            testID={'new-password-retype'}
                          />
                        )}
                      </View>
                      <View style={styles.button}>
                        <Button
                          label={t('auth.changePassword.input.label-Save')}
                          onPress={performPasswordChange}
                          testID={'btn-submit-change-password'}
                        />
                      </View>
                    </>
                  )}
                </>
              )}
            </HoliBox>
          </View>
        </ScrollView>
      )}
    />
  )
}

export default ChangePassword

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    inner: {
      flex: 1,
      backgroundColor: theme.colors.background20,
      ...Platform.select({
        web: {
          paddingBottom: dimensions.bottomBarHeight,
          minHeight: '100%',
        },
        android: {
          paddingBottom: dimensions.bottomBarHeight,
        },
      }),
    },
    inputFieldsContainer: {
      paddingTop: 24,
      gap: 16,
    },
    button: {
      marginVertical: 24,
      maxWidth: dimensions.maxButtonWidth,
      alignSelf: 'center',
      width: '100%',
    },
  })
