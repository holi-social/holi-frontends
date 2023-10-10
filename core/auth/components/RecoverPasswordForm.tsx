import { RecoveryFlow, UpdateRecoveryFlowWithCodeMethod } from '@ory/kratos-client'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import AlreadyHaveAccountText from '@holi/core/auth/components/AlreadyHaveAccountText'
import FormBuilder from '@holi/core/auth/components/FormBuilder'
import RegistrationButton from '@holi/core/auth/components/RegistrationButton'
import { initPasswordRecoveryFlow, updatePasswordRecoveryFlowEmail } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSafeDispatch } from '@holi/core/helpers'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'

export type RecoverPasswordFormProps = {
  onSubmit?: (success: boolean, flow?: RecoveryFlow, email?: string) => void
  style?: ViewStyle | ViewStyle[]
}

const RecoverPasswordForm = (props: RecoverPasswordFormProps) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()

  const [flow, setFlow] = useState<RecoveryFlow>()

  const safeSetFlow = useSafeDispatch(setFlow)

  const initializeFlow = useCallback(() => {
    initPasswordRecoveryFlow()
      .then(({ data: flow }) => {
        safeSetFlow(flow)
      })
      .catch((error: Error) =>
        displayError(error, 'Failed to initialize flow to recover password', {
          location: 'RecoverPasswordForm.initializeFlow',
        })
      )
  }, [safeSetFlow, displayError])

  useEffect(() => initializeFlow(), [initializeFlow])

  const requestPasswordRecovery = async (payload: UpdateRecoveryFlowWithCodeMethod): Promise<void> => {
    if (flow && payload?.email) {
      try {
        await updatePasswordRecoveryFlowEmail(flow, payload.email)
        props.onSubmit?.(true, flow, payload.email)
      } catch (err) {
        handleFormSubmitError(
          setFlow,
          initializeFlow,
          (error) =>
            displayError(error, 'Failed to submit form', {
              location: 'RecoverPasswordForm.requestPasswordRecovery',
            }),
          err
        )
        props.onSubmit?.(false)
      }
    }
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
