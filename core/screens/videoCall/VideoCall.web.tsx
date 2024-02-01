import { withProfiler } from '@sentry/react'
import React from 'react'

import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { VideoCallParams } from '@holi/core/screens/videoCall/VideoCall.shared'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

const { useParam } = createParamHooks<VideoCallParams>()

const VideoCall: React.FC = () => {
  const [roomName] = useParam('roomName')

  if (!roomName) {
    return <HoliLoader />
  }

  // Immediately redirect to the api that adds login information to the video call
  const videoCallUrl = '/api/video-call/' + roomName
  window.location.href = videoCallUrl
  return null
}

const WrappedVideoCall = () => (
  <FeatureToggleGuard toggleName={FeatureToggleName.VIDEOCALL} featureNameKey="spaces.videocall.maintenance.feature">
    <VideoCall />
  </FeatureToggleGuard>
)

export default withProfiler(WrappedVideoCall, { name: 'VideoCall' })
