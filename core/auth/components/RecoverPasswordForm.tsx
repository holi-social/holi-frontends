import { SelfServiceRecoveryFlow, SubmitSelfServiceRecoveryFlowWithLinkMethodBody } from '@ory/kratos-client'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import FormBuilder from '@holi/core/auth/components/FormBuilder'
import { initPasswordRecoveryFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { newKratosSdk } from '@holi/core/auth/helpers/sdk'
import { displayError } from '@holi/core/errors/helpers'
import { useSafeDispatch } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type RecoverPasswordFormProps = {
  onSubmit?: (success: boolean) => void
  style?: ViewStyle | ViewStyle[]
}

const RecoverPasswordForm: React.VFC<RecoverPasswordFormProps> = (props: RecoverPasswordFormProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const mixins = useStyleMixins()

  const [flow, setFlow] = useState<SelfServiceRecoveryFlow>()

  const safeSetFlow = useSafeDispatch(setFlow)

  const initializeFlow = useCallback(() => {
    // if (isLoggedIn) return
    initPasswordRecoveryFlow()
      .then(({ data: flow }) => {
        safeSetFlow(flow)
      })
      .catch((error: Error) => displayError(error, t('auth.registration.error.initialization')))
  }, [safeSetFlow, t])

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

      <HoliHeading level="2" size="xSmall" style={styles.headline3}>
        {t('auth.registration.alreadyHasAccount')}{' '}
        <HoliButton
          transparent
          inline
          variant="small"
          label={t('auth.login')}
          style={mixins.inlineButtonFixSmall}
          onPress={() => navigate('/login')}
          testID="btn-to-login-form"
        >
          <HoliText size="small" style={styles.loginLinkText}>
            {t('auth.login')}
          </HoliText>
        </HoliButton>
      </HoliHeading>

      <HoliHeading level="2" style={styles.headline2}>
        {t('auth.login.signUp.link.headline')}
      </HoliHeading>

      <HoliButton
        onPress={() => navigate('/registration')}
        label={t('auth.loginProtection.registration')}
        type="secondary"
        style={styles.button}
        testID="btn-to-registration-form"
      >
        {t('auth.loginProtection.registration')}
      </HoliButton>
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
  headline3: {
    marginTop: 16,
    textAlign: 'center',
  },
  loginLinkText: {
    color: colors.positivepurple,
  },
})
