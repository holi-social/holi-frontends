import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { jitsiUrl } from '@holi/core/screens/spaces/helpers/config'
import { Space, VideoCallLink } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'

interface VideoCallLinkCardProps {
  space: Space
  videoCallLink: VideoCallLink
}
const VideoCallLinkCard: React.FC<VideoCallLinkCardProps> = ({ space, videoCallLink }: VideoCallLinkCardProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const navigateToVideoCall = useCallback(() => {
    if (Platform.OS === 'web') {
      Linking.openURL(videoCallLink.url)
    } else {
      const webViewUrl = videoCallLink.url.replace(jitsiUrl, `/spaces/${space.name}/video-call`)
      navigate(webViewUrl)
    }
  }, [navigate, space.name, videoCallLink.url])
  return (
    <View>
      <HoliButton transparent label={videoCallLink.roomName} onPress={navigateToVideoCall}>
        <HoliText>{videoCallLink.created}</HoliText>
        <HoliHeading level="2">{videoCallLink.roomName}</HoliHeading>
        <HoliText>{videoCallLink.url}</HoliText>
      </HoliButton>
      <HoliActionDrawer.Drawer label={t('global.moreOptions')} testID="btn-video-call-link-more-options">
        <HoliHeading level="2">{videoCallLink.roomName}</HoliHeading>
        <HoliText>{videoCallLink.url}</HoliText>
        {/* <HoliActionDrawer.Action
          isLoading={isLoadingDeleteTask}
          action="delete"
          title={t('spaces.digitalTool.delete.label')}
          variant="danger"
          testID="btn-to-delete-task"
          showConfirmation
        >
          <HoliActionDrawer.Confirmation
            title={t('spaces.tasks.delete.confirmation.title')}
            description={t('spaces.tasks.delete.confirmation.description')}
            testID="task-delete"
            handleConfirmation={deleteTask}
            buttonType="warning"
            hasDismissBtn
            requireLogin
          />
        </HoliActionDrawer.Action> */}
      </HoliActionDrawer.Drawer>
    </View>
  )
}

export default VideoCallLinkCard
