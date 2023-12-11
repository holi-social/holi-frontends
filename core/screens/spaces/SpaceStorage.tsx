import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { useEffect, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, useWindowDimensions } from 'react-native'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import HoliWebView from '@holi/core/components/HoliWebView'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useSpaceOnboarding } from '@holi/core/screens/spaces/helpers/hooks'
import { getUrlForSpaceStorage } from '@holi/core/screens/spaces/helpers/urls'
import StorageOnboardModal from '@holi/core/screens/spaces/linkHub/components/StorageOnboardModal'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { vars } from '@holi/ui/styles/globalVars'

export type SpaceStorageParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<SpaceStorageParams>()

const SpaceStorage: React.FC = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)
  const { t } = useTranslation()
  const { replaceRoute } = useRouting()
  const { height: deviceHeight } = useWindowDimensions()
  const styles = getStyles(deviceHeight)
  const { loading, error, data } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName },
    onError: (error) =>
      !isNotFoundError(error) &&
      logError(error, 'Failed to load space', { location: 'SpaceStorage.spaceByIdQuery', spaceIdOrName }),
  })
  const space = data?.spaceById
  const storageUrl = getUrlForSpaceStorage(space)
  const setScreenOptions = useSetScreenOptions()

  const { visible, show, hide } = useModalState()

  const { isOnboarded, setIsOnboarded } = useSpaceOnboarding('space_storage_is_onboarded')

  useEffect(() => {
    if (!isOnboarded) {
      show()
    }
  }, [show, isOnboarded])

  useLayoutEffect(() => {
    setScreenOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="small" numberOfLines={1}>
          {t('spaces.storage.title')}
        </HoliHeading>
      ),
    })
  }, [setScreenOptions, t])

  if ((error && isNotFoundError(error)) || (!loading && !space)) {
    replaceRoute('NotFound')
    return null
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error || !space) {
    return <></>
  }

  if (Platform.OS === 'web') {
    // Directly redirect to the storage
    window.location.href = storageUrl
    return null
  }

  const handleModalClose = () => {
    setIsOnboarded().finally(hide)
  }

  return (
    <DefaultLayout hasFooterTabBar={false}>
      <StorageOnboardModal visible={visible} handleModalClose={handleModalClose} />
      <HoliWebView
        style={styles.webView}
        webViewProps={{ setSupportMultipleWindows: false, source: { uri: storageUrl } }}
      />
    </DefaultLayout>
  )
}

const WrappedSpaceStorage = () => (
  <FeatureToggleGuard toggleName={FeatureToggleName.STORAGE} featureNameKey="spaces.storage.maintenance.feature">
    <SpaceStorage />
  </FeatureToggleGuard>
)

const getStyles = (deviceHeight: number) =>
  StyleSheet.create({
    webView: {
      minHeight: deviceHeight - +vars.topBarHeight,
    },
    messageContainer: {
      alignItems: 'center',
      marginTop: vars.topBarHeight + 50,
    },
  })

export default withProfiler(WrappedSpaceStorage, { name: 'SpaceStorage' })
