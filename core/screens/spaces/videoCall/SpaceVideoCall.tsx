import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import { Camera } from 'expo-camera'
import React, { useCallback, useEffect, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, useWindowDimensions } from 'react-native'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import HoliWebView from '@holi/core/screens/spaces/components/HoliWebView'
import { getUrlForSpaceVideoCall } from '@holi/core/screens/spaces/helpers/urls'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceVideoCallParams = {
  spaceIdOrName: string
  roomName: string
}

const { useParam } = createParam<SpaceVideoCallParams>()

const SpaceVideoCall: React.FC<SpaceVideoCallParams> = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)
  const [roomName] = useParam('roomName')
  const { t } = useTranslation()
  const { height: deviceHeight } = useWindowDimensions()
  const styles = getStyles(deviceHeight)
  const mixins = useStyleMixins()
  const { user } = useLoggedInUser()
  const { loading, error, data } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName },
  })
  const space = data?.spaceById
  const displayNameParam = user?.firstName ? `&userInfo.displayName="${user?.firstName}"` : ''
  const videoCallUrl = encodeURI(
    `${getUrlForSpaceVideoCall(space, roomName)}#config.disableDeepLinking=true${displayNameParam}`
  )
  const setScreenOptions = useSetScreenOptions()

  useLayoutEffect(() => {
    if (roomName) {
      setScreenOptions({
        title: roomName,
      })
    }
  }, [roomName, setScreenOptions])

  const requestPermissions = useCallback(() => {
    if (Platform.OS !== 'web') {
      Camera.requestCameraPermissionsAsync().then((response) => {
        response.granted && Camera.requestMicrophonePermissionsAsync()
      })
    }
  }, [])

  useEffect(requestPermissions, [requestPermissions])

  if ((error && isNotFoundError(error)) || (!loading && !space)) {
    return (
      <DefaultLayout style={mixins.container} contentStyle={styles.messageContainer}>
        <HoliText>{t('spaces.spaceDetails.notFound', { spaceIdOrName })}</HoliText>
      </DefaultLayout>
    )
  }
  if (error) {
    logError(error, `[SpaceVideoCall.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error || !space) {
    return <></>
  }

  if (Platform.OS === 'web') {
    // Directly redirect to the video call
    window.location.href = videoCallUrl
    return null
  }

  // Webview props for video call in webview, found on https://docs.whereby.com/embedding-rooms/in-a-mobile-app/in-react-native via https://github.com/react-native-webview/react-native-webview/issues/508
  const webViewProps = {
    mediaPlaybackRequiresUserAction: false,
    allowsInlineMediaPlayback: true,
    javaScriptEnabled: true,
    domStorageEnabled: true,
    // Overriding the user agent for iOS webview, otherwise jitsi won't support it
    userAgent: Platform.OS === 'ios' ? 'Mozilla/5.0 (X11; Linux i586; rv:31.0) Gecko/20100101 Firefox/31.0' : undefined,
  }
  return (
    <DefaultLayout>
      <HoliWebView style={styles.webView} uri={videoCallUrl} webViewProps={webViewProps} />
    </DefaultLayout>
  )
}

const getStyles = (deviceHeight: number) =>
  StyleSheet.create({
    webView: {
      minHeight: deviceHeight - +vars.topBarHeight - 20,
      marginTop: vars.topBarHeight,
    },
    messageContainer: {
      alignItems: 'center',
      marginTop: vars.topBarHeight + 50,
    },
  })

export default withProfiler(SpaceVideoCall, { name: 'SpaceVideoCall' })
