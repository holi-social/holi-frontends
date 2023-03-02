import { useQuery } from '@apollo/client'
import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, useWindowDimensions } from 'react-native'
import { WebView } from 'react-native-webview'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'

export type SpaceCloudParams = {
  spaceId: string
}

const { useParam } = createParam<SpaceCloudParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const SpaceCloud: React.VFC<ScreenProps> = () => {
  const [spaceId] = useParam('spaceId')
  const { height, width } = useWindowDimensions()

  const { t } = useTranslation()
  const { navigate, replaceRoute } = useRouting()

  const { setOptions } = useUnifiedNavigation()

  const { loading, error, data } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { id: spaceId },
  })

  const space = data?.spaceById
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

  const { visible, show, hide } = useModalState()

  // ? Test for injecting javascript into the WebView (e.g. for spikes regarding skipping login screen)
  // const runFirst = `
  //     document.body.style.backgroundColor = 'red';
  //     // setTimeout(function() { window.alert('hi') }, 2000);
  //     localStorage.setItem('session', 'my-token');
  //     window.alert('Session: ' + localStorage.getItem('session'));
  //     true; // note: this is required, or you'll sometimes get silent failures
  //   `

  useLayoutEffect(() => {
    setOptions({
      animation: 'slide_from_bottom',
      headerTransparent: false,
      // headerStyle: { backgroundColor: 'transparent' },
      headerTitle: 'Space Cloud',
      headerLeft: () =>
        Platform.OS === 'web' ? <HeaderBackButton icon="arrow-left" /> : <HeaderBackButton icon="arrow-down-s" />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [hide, setOptions, show, t, visible, isAdmin, navigate, replaceRoute, spaceId])

  if ((error && isNotFoundError(error)) || (!loading && !space)) {
    return (
      <DefaultLayout>
        <HoliText>{t('spaces.spaceCloud.notFound', { spaceId })}</HoliText>
      </DefaultLayout>
    )
  }
  if (error) {
    logError(error, `[SpaceCloud.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error || !space) {
    return <></>
  }

  return (
    <>
      <WebView source={{ uri: 'https://staging.web.project-holi.org/profile' }} style={{ height, width }} />
    </>
  )
}

export default memo(SpaceCloud)
