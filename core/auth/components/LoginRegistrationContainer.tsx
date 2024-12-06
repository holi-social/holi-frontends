import type React from 'react'
import { Platform, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useRedirect } from '@holi/core/navigation/hooks/useRedirect'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { onboardingStateVar } from '@holi/core/screens/onboarding/hooks/onboardingState'

interface LoginRegistrationContainerProps {
  style?: StyleProp<ViewStyle>
}

const LoginRegistrationContainer = ({ children, style }: React.PropsWithChildren<LoginRegistrationContainerProps>) => {
  const { isLoggedIn, isLoading } = useLoggedInUser()
  const redirect = useRedirect('/')

  useIsomorphicLayoutEffect(() => {
    // ONBOARDING-ISSUE: previuosly this watcher could cause problems with the onboarding and redirected
    // to HomeFeed after user logged in and onboarding was not finished.
    // We can login and continue onboarding if it's not finished (missing Email verification or User names)
    // so, check onboarding state and redirect user only when it's finished
    if (isLoggedIn && onboardingStateVar() === 'finished') {
      redirect(true)
    }
  }, [isLoggedIn, redirect])

  if (isLoading || isLoggedIn)
    return (
      <View style={styles.viewContainer}>
        <HoliLoader />
      </View>
    )

  return <View style={[styles.viewContainer, style]}>{children}</View>
}

const styles = StyleSheet.create({
  viewContainer: {
    marginTop: Platform.select({
      native: 32,
      web: 80,
    }),
    alignSelf: 'center',
    maxWidth: 500,
    width: '100%',
    alignItems: 'center',
    ...Platform.select({
      native: {
        // enables scroll up when keyboard overlaps submit button
        paddingBottom: 500,
      },
    }),
  },
})

export default LoginRegistrationContainer
