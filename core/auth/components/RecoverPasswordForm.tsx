import { SelfServiceRecoveryFlow, SubmitSelfServiceRecoveryFlowWithLinkMethodBody } from '@ory/kratos-client'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import AlreadyHaveAccountText from '@holi/core/auth/components/AlreadyHaveAccountText'
import FormBuilder from '@holi/core/auth/components/FormBuilder'
import RegistrationButton from '@holi/core/auth/components/RegistrationButton'
import { initPasswordRecoveryFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { newKratosSdk } from '@holi/core/auth/helpers/sdk'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSafeDispatch } from '@holi/core/helpers'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'

export type RecoverPasswordFormProps = {
  onSubmit?: (success: boolean) => void
  style?: ViewStyle | ViewStyle[]
}

const RecoverPasswordForm: React.VFC<RecoverPasswordFormProps> = (props: RecoverPasswordFormProps) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()

  const [flow, setFlow] = useState<SelfServiceRecoveryFlow>()

  const safeSetFlow = useSafeDispatch(setFlow)

  const initializeFlow = useCallback(() => {
    // if (isLoggedIn) return
    initPasswordRecoveryFlow()
      .then(({ data: flow }) => {
        safeSetFlow(flow)
      })
      .catch((error: Error) => displayError(error, t('auth.registration.error.initialization')))
  }, [safeSetFlow, t, displayError])

  useLayoutEffect(() => initializeFlow(), [initializeFlow])

  const requestPasswordRecovery = (payload: SubmitSelfServiceRecoveryFlowWithLinkMethodBody): Promise<void> => {
    if (flow)
      return newKratosSdk()
        .submitSelfServiceRecoveryFlow(flow.id, undefined, payload)
        .then(() => {
          initializeFlow()
          props.onSubmit?.(true)
        })
        .catch((error) => {
          handleFormSubmitError(setFlow, initializeFlow)(error)
          props.onSubmit?.(false)
        })
        .catch((error) => displayError(error, t('auth.login.error.login')))
    return Promise.resolve()
  }

  return (
    <View style={[styles.viewContainer, props.style]}>
      <FormBuilder flow={flow} onSubmit={requestPasswordRecovery} style={styles.recoverPasswordForm} />

      <AlreadyHaveAccountText mobileNavigateBackFirst style={styles.loginHeadline} />

      <HoliHeading level="2" style={styles.headline2}>
        {t('auth.login.signUp.link.headline')}
      </HoliHeading>

      <RegistrationButton style={styles.button} />
    </View>
  )
}

export default RecoverPasswordForm

const styles = StyleSheet.create({
  viewContainer: {
    width: '100%',
  },
  recoverPasswordForm: {
    // reserves space for inputs plus submit until ory flow is done
    minHeight: 170,
  },
  button: {
    marginTop: 20,
  },
  headline2: {
    marginTop: 40,
    textAlign: 'center',
  },
  loginHeadline: {
    marginTop: 16,
    textAlign: 'center',
  },
})
