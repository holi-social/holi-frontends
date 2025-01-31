import { withProfiler } from '@sentry/react'
import type React from 'react'

import PosthogFeatureFlagGuard from '@holi/core/featureFlags/components/PosthogFeatureFlagGuard'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import type { VideoCallParams } from '@holi/core/screens/videoCall/VideoCall.shared'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

const { useParam } = createParamHooks<VideoCallParams>()

const VideoCall: React.FC = () => {
  const roomName = useParam('roomName')

  if (!roomName) {
    return <HoliLoader />
  }

  // Immediately redirect to the api that adds login information to the video call
  const videoCallUrl = '/api/video-call/' + roomName
  window.location.href = videoCallUrl
  return null
}

const WrappedVideoCall = () => (
  <PosthogFeatureFlagGuard featureFlagKey={FeatureFlagKey.VIDEO_CALL} i18nKey="spaces.videocall.maintenance.feature">
    <VideoCall />
  </PosthogFeatureFlagGuard>
)

export default withProfiler(WrappedVideoCall, { name: 'VideoCall' })
