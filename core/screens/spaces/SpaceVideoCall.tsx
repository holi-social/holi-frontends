import { useQuery } from '@apollo/client'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, useWindowDimensions } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import createParam from '@holi/core/navigation/hooks/useParam'
import HoliWebView from '@holi/core/screens/spaces/components/HoliWebView'
import { getUrlForSpaceVideoCall } from '@holi/core/screens/spaces/helpers/urls'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { vars } from '@holi/ui/styles/globalVars'

export type SpaceVideoCallParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<SpaceVideoCallParams>()

const SpaceVideoCall: React.FC<SpaceVideoCallParams> = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName') // spaceIdOrName can either be space.id or space.name (slug)
  const { t } = useTranslation()
  const { height: deviceHeight } = useWindowDimensions()
  const styles = getStyles(deviceHeight)
  const { loading, error, data } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName },
  })
  const space = data?.spaceById
  const videoCallUrl = getUrlForSpaceVideoCall(space)

  // useEffect(() => {
  //   if (space) {
  //     const userInfo = { displayName: 'User', email: 'user@example.com', avatar: 'https:/gravatar.com/avatar/abc123' }
  //     const options = {
  //       audioMuted: false,
  //       audioOnly: false,
  //       videoMuted: false,
  //       subject: 'your subject',
  //       token: 'your token',
  //     }
  //     const meetFeatureFlags = {
  //       addPeopleEnabled: true,
  //       calendarEnabled: true,
  //       callIntegrationEnabled: true,
  //       chatEnabled: true,
  //       closeCaptionsEnabled: true,
  //       inviteEnabled: true,
  //       androidScreenSharingEnabled: true,
  //       liveStreamingEnabled: true,
  //       meetingNameEnabled: true,
  //       meetingPasswordEnabled: true,
  //       pipEnabled: true,
  //       kickOutEnabled: true,
  //       conferenceTimerEnabled: true,
  //       videoShareButtonEnabled: true,
  //       recordingEnabled: true,
  //       reactionsEnabled: true,
  //       raiseHandEnabled: true,
  //       tileViewEnabled: true,
  //       toolboxAlwaysVisible: false,
  //       toolboxEnabled: true,
  //       welcomePageEnabled: false,
  //     }
  //     JitsiMeet.call(videoCallUrl, userInfo, options, meetFeatureFlags)
  //     /* TODO(SF) You can also use JitsiMeet.audioCall(url) for audio only call */
  //     /* TODO(SF) You can programmatically end the call with JitsiMeet.endCall() */
  //   }
  //   return JitsiMeet.endCall // TODO(SF) is this correct?
  // }, [space])

  if ((error && isNotFoundError(error)) || (!loading && !space)) {
    return (
      <DefaultLayout style={styles.defaultLayout} contentStyle={styles.messageContainer}>
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
  } else {
    return (
      <DefaultLayout>
        <HoliWebView style={styles.webView} uri={videoCallUrl} />
      </DefaultLayout>
    )
  }
}

const getStyles = (deviceHeight: number) =>
  StyleSheet.create({
    webView: {
      minHeight: deviceHeight,
      marginTop: vars.topBarHeight,
    },
    messageContainer: {
      alignItems: 'center',
      marginTop: vars.topBarHeight + 50,
    },
    defaultLayout: {
      paddingBottom: 0,
      ...Platform.select({
        web: {
          minHeight: '100vh',
        },
      }),
    },
  })

export default SpaceVideoCall
