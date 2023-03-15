import { LoginFlow, SettingsFlow, UiNode } from '@ory/kratos-client'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useAuth } from '@holi/core/auth/AuthContextProvider'
import { getValidationErrorText } from '@holi/core/auth/components/FormInputField'
import {
  getSessionFromStorage,
  initReauthFlow,
  initSettingsFlow,
  submitReauthFlow,
  submitSettingsFlow,
} from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError, oryNodeIsInput } from '@holi/core/auth/helpers/form'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSafeDispatch } from '@holi/core/helpers'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const ChangePassword: React.VFC = () => {
  const { t, i18n } = useTranslation()
  const [oldPwdNode, setOldPwdNode] = useState<UiNode>()
  const [newPwdNode, setNewPwdNode] = useState<UiNode>()
  const [oldPwd, setOldPwd] = useState<string>('')
  const [newPwd, setNewPwd] = useState<string>('')
  const { isLoggedIn } = useAuth()
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
          Change Password
        </HoliHeading>
      ),
    })

    initForm()
  }, [setOptions, initForm])

  const performPasswordChange = () => {
    if (reauthFlow && settingsFlow) {
      submitReauthFlow(reauthFlow, oldPwd, sessionToken)
        .then(() => {
          setOldPwdNode(undefined)
          submitSettingsFlow(settingsFlow, newPwd, sessionToken)
            .then(() => {
              openToast('Du hast dein Passwort erfolgreich geändert.', HoliToastType.SUCCESS, 4000)
              navigate('/profile')
            })
            .catch(
              handleFormSubmitError((data) => {
                const foundNode = data.ui.nodes.find(
                  (node: UiNode) =>
                    oryNodeIsInput(node.attributes) &&
                    node.attributes.name === 'password' &&
                    node.attributes.type === 'password'
                )
                setNewPwdNode(foundNode)
              }, initForm)
            )
            .catch((error) => {
              // technical error
              displayError(error, '## Change password ##')
            })
        })
        .catch(
          handleFormSubmitError((data) => {
            const foundNode = data.ui.nodes.find(
              (node: UiNode) =>
                oryNodeIsInput(node.attributes) &&
                node.attributes.name === 'password' &&
                node.attributes.type === 'password'
            )
            // sometimes messages are no attached to the node but are transfered generally, so we move them to the node
            if (data.ui.messages && !foundNode?.messages?.length) {
              foundNode.messages = data.ui.messages
            }
            setOldPwdNode(foundNode)
          }, initForm)
        )
        .catch((error) => {
          // technical error
          displayError(error, '## Change password ##')
        })
    }
  }

  return (
    <DefaultLayout style={styles.layout}>
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
              //validationErrorText={getValidationErrorText(i18n, oldMessage)}
              maxNoOfCharacters={200}
              onChange={setOldPwd}
              type="password"
              //inputProps={textInputOverride ? textInputOverride(node, inputProps) : inputProps}
              style={styles.reauthForm}
              testID={'input-old-pasword'}
            />
            <HoliTextInput
              inputLabel={t('auth.changePassword.input.label-NewPassword')}
              accessibilityLabel={t('auth.changePassword.input.label-NewPassword')}
              placeholder={t('auth.changePassword.input.placeholder-NewPassword')}
              validationErrorText={newPwdNode && getValidationErrorText(newPwdNode, i18n)}
              //validationErrorText={getValidationErrorText(i18n, newMessage)}
              maxNoOfCharacters={200}
              onChange={setNewPwd}
              type="password"
              //inputProps={textInputOverride ? textInputOverride(node, inputProps) : inputProps}
              style={styles.reauthForm}
              testID={'input-old-pasword'}
            />
            <HoliButton
              label={t('auth.changePassword.input.label-Save')}
              //style={props.style || {}}
              onPress={performPasswordChange}
              testID={'submit-new-password'}
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
  reauthForm: {
    // reserves space for the form until ory flow is done
    // minHeight: 100,
    width: '100%',
  },
  settingsForm: {
    // reserves space for the form until ory flow is done
    // minHeight: 235,
    width: '100%',
  },
})
