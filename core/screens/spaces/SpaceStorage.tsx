import { withProfiler } from '@sentry/react'
import type React from 'react'
import { useEffect, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, useWindowDimensions } from 'react-native'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import HoliWebView from '@holi/core/components/HoliWebView'
import PosthogFeatureFlagGuard from '@holi/core/featureFlags/components/PosthogFeatureFlagGuard'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { getUrlForSpaceStorage } from '@holi/core/screens/spaces/helpers/urls'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import { SpaceOnboardings, useSpaceOnboarding } from '@holi/core/screens/spaces/hooks/useSpaceOnboarding'
import StorageOnboardModal from '@holi/core/screens/spaces/linkHub/components/StorageOnboardModal'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useTheme } from '@holi/ui/styles/theme'

export type SpaceStorageParams = {
  spaceIdOrName: string
}

const { useParam } = createParamHooks<SpaceStorageParams>()

const SpaceStorage: React.FC = () => {
  const spaceIdOrName = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)
  const { t } = useTranslation()
  const { height: deviceHeight } = useWindowDimensions()
  const styles = getStyles(deviceHeight)
  const { loading, error, space } = useSpace(spaceIdOrName)
  const storageUrl = getUrlForSpaceStorage(space)
  const setScreenOptions = useSetScreenOptions()
  const { needsOnboarding, setIsOnboarded } = useSpaceOnboarding(SpaceOnboardings.StorageOnboarding)
  const { show, props: onboardModalProps } = useModalState({ onDismiss: setIsOnboarded })

  const { theme } = useTheme()

  useEffect(() => {
    if (needsOnboarding) {
      show()
    }
  }, [show, needsOnboarding])

  useLayoutEffect(() => {
    setScreenOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="s" numberOfLines={1}>
          {t('spaces.storage.title')}
        </HoliHeading>
      ),
    })
  }, [setScreenOptions, t])

  // Error and loading states are handled the same way and just hide the component
  if (loading || error || !space) {
    return <></>
  }

  if (Platform.OS === 'web') {
    // Directly redirect to the storage
    window.location.href = storageUrl
    return null
  }

  return (
    <DefaultLayout hasFooterTabBar={false}>
      <StorageOnboardModal {...onboardModalProps} />
      <HoliWebView
        style={styles.webView}
        webViewProps={{ setSupportMultipleWindows: false, source: { uri: storageUrl } }}
        theme={theme}
      />
    </DefaultLayout>
  )
}

const WrappedSpaceStorage = () => (
  <PosthogFeatureFlagGuard featureFlagKey={FeatureFlagKey.STORAGE} i18nKey="spaces.storage.maintenance.feature">
    <SpaceStorage />
  </PosthogFeatureFlagGuard>
)

const getStyles = (deviceHeight: number) =>
  StyleSheet.create({
    webView: {
      minHeight: deviceHeight - dimensions.topBarHeight,
    },
    messageContainer: {
      alignItems: 'center',
      marginTop: dimensions.topBarHeight + 50,
    },
  })

export default withProfiler(WrappedSpaceStorage, { name: 'SpaceStorage' })
