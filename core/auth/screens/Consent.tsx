// import { SelfServiceLoginFlow, SubmitSelfServiceLoginFlowBody } from '@ory/kratos-client'
import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import type { RootStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'

// import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
// import HoliButton from '@holi/ui/components/molecules/HoliButton'

type ScreenProps = NativeStackScreenProps<RootStackScreens>

const Consent: React.VFC<ScreenProps> = () => {
  // const { isLoggedIn, setUserLoggedIn } = useAuth()
  // const [flow, setFlow] = useState<SelfServiceLoginFlow | undefined>(undefined)
  const { t } = useTranslation()
  const { setOptions } = useUnifiedNavigation()
  // const { displayError } = useErrorHandling()

  useLayoutEffect(() => {
    setOptions({
      headerTransparent: true,
      headerLeft: () => null,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setOptions, t])

  // const initializeFlow = useCallback(() => {
  //   initLoginFlow()
  //     .then((response) => {
  //       const { data: flow } = response
  //       setFlow(flow)
  //     })
  //     .catch((error) => displayError(error, t('auth.login.error.initialization')))
  // }, [t, displayError])

  // useEffect(() => {
  //   !isLoggedIn && initializeFlow()
  // }, [isLoggedIn, initializeFlow])

  // const performLogin = (payload: SubmitSelfServiceLoginFlowBody): Promise<void> => {
  //   if (flow)
  //     return newKratosSdk()
  //       .submitSelfServiceLoginFlow(flow.id, undefined, payload)
  //       .then(({ data }) =>
  //         client.clearStore().then(() => {
  //           setUserLoggedIn(data as OrySessionContext)
  //         })
  //       )
  //       .catch(handleFormSubmitError(setFlow, initializeFlow))
  //       .catch((error) => displayError(error, t('auth.login.error.login')))
  //   return Promise.resolve()
  // }

  return (
    <View style={styles.consentForm}>
      <HoliText>Hello consent</HoliText>
    </View>
  )
}

export default memo(Consent)

const styles = StyleSheet.create({
  consentForm: {
    // reserves space for inputs plus submit until ory flow is done
    height: '100%',
    backgroundColor: 'red',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 20,
  },
  headline2: {
    marginTop: 40,
  },
  headline3: {
    marginTop: 16,
  },
})
