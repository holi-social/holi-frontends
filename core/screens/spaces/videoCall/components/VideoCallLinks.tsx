import type React from 'react'
import { useTranslation } from 'react-i18next'
import { type StyleProp, View, type ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import { SpaceUserConnectionType } from '@holi/api/graphql/graphql-codegen'
import AddVideoCallLink from '@holi/core/screens/spaces/videoCall/components/AddVideoCallLink'
import VideoCallLinkCard from '@holi/core/screens/spaces/videoCall/components/VideoCallLinkCard'
import { useVideoCallLinkStorage } from '@holi/core/screens/spaces/videoCall/useVideoCallLinkStorage'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'

interface VideoCallLinksProps {
  spaceIdOrName: string | undefined
  style?: StyleProp<ViewStyle>
}

const VideoCallLinks: React.FC<VideoCallLinksProps> = ({ spaceIdOrName, style }: VideoCallLinksProps) => {
  const { navigate } = useRouting()
  const { t } = useTranslation()

  const { loading: loadingSpace, space } = useSpace(spaceIdOrName)

  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Administrator)
  const isCollaborator = space?.connectionStatusToMyself?.includes(SpaceUserConnectionType.Member)

  const { videoCallLinks } = useVideoCallLinkStorage(space?.name)

  if (loadingSpace || !space) {
    // TODO: display skeleton
    return <></>
  }

  if (!loadingSpace && !isAdmin && !isCollaborator) {
    navigate(`/spaces/${spaceIdOrName}`)
    return null
  }

  return (
    <View style={style}>
      <HoliBox padding={[0, 16, 16, 16]}>
        <AddVideoCallLink space={space} />
        {videoCallLinks.length > 0 && (
          <HoliBox padding={[32, 0, 0, 0]}>
            <HoliHeading level="2" size="s">
              {t('spaces.videocall.generatedLinks.heading')}
            </HoliHeading>
          </HoliBox>
        )}
        {videoCallLinks.map((link) => (
          <VideoCallLinkCard key={link.id} videoCallLink={link} />
        ))}
      </HoliBox>
    </View>
  )
}

export default VideoCallLinks
