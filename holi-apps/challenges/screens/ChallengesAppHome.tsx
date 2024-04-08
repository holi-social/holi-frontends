import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'

import { AuthorizationHeaders, createAuthorizationHeaders } from '@holi/api/helpers'
import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import HoliWebView from '@holi/core/components/HoliWebView'
import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useTheme } from '@holi/ui/styles/theme'

import { challengeAppBaseUrl } from '@holi-apps/challenges/config'

export const ChallengesAppHome = () => {
  const setScreenOptions = useSetScreenOptions()
  const { theme } = useTheme()
  const [authHeaders, setAuthHeaders] = useState<AuthorizationHeaders | undefined>(undefined)

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="s">
          Challenges
        </HoliHeading>
      ),
      headerLeft: () => <HeaderBackButton tintColor={theme.colors.dark} />,
      headerTransparent: true,
      headerStyle: { backgroundColor: theme.colors.background10 },
      headerTintColor: theme.colors.light,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, theme.colors])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(async () => {
      setAuthHeaders(await createAuthorizationHeaders())
    })()
  }, [])

  if (!authHeaders) {
    return <HoliLoader />
  }

  return (
    <FeatureToggleGuard toggleName={FeatureToggleName.CHALLENGES} featureNameKey="challenges:maintenance.feature">
      <HoliWebView
        style={styles.container}
        allowsBackForwardNavigationGesturesMultiOS={true}
        webViewProps={{
          setSupportMultipleWindows: false,
          allowsBackForwardNavigationGestures: true,
          allowsInlineMediaPlayback: true,
          mediaCapturePermissionGrantType: 'grant',
          sharedCookiesEnabled: true,
          source: {
            uri: challengeAppBaseUrl,
            headers: { ...authHeaders, 'X-Client-Platform': 'holi' },
          },
        }}
        theme={theme}
      />
    </FeatureToggleGuard>
  )
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 84,
  },
})
